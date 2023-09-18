/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import FormButtonToolbar from "../../../../../../common/UIBasicComponents/FormButtonToolbar/FormButtonToolbar";
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../../../../common/DialogComponent/DialogComponent";
import { LOADING_DISPLAY_NONE } from "../../../../../../../utils/front-end-util/frontend-util";
import { Session } from "next-auth";
import { useState } from "react";
import { Form } from "react-final-form";
import { Loader, Modal, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import {
  InternalRoleGroup,
  PatchGroupMapping,
  RoleGroupList,
} from "../../../../../../../models/role/role";
import RequestMethod from "../../../../../../../models/api/requestMethod";
import { encodeRoleGroup } from "../../../../../../../utils/role-utils";

interface DeleteGroupMappingComponentProps {
  session: Session;
  open: boolean;
  onClose: () => void;
  roleName: string;
  group: InternalRoleGroup;
  getGroups: () => Promise<void>;
}

/**
 *
 * @param prop - session, user (user details), open (whether the modal open or close), onClose (on modal close)
 *
 * @returns Modal form to delete the group
 */
export default function DeleteGroupMappingComponent(
  props: DeleteGroupMappingComponentProps
) {
  const { session, open, onClose, roleName, group, getGroups } = props;
  const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);
  const toaster = useToaster();

  const onGroupDelete = (response: RoleGroupList | null): void => {
    if (response) {
      successTypeDialog(toaster, "Success", "Group Deleted Successfully");
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while deleting the Group. Try again."
      );
    }
  };

  const onSubmit = (): void => {
    deleteGroupMappings(session, roleName, group)
      .then((response) => onGroupDelete(response))
      .finally(() => {
        getGroups().finally();
      });

    onClose();
  };

  async function deleteGroupMappings(
    session: Session,
    roleName: string,
    groupMapping: InternalRoleGroup
  ): Promise<RoleGroupList | null> {
    try {
      const patchBody: PatchGroupMapping = {
        added_groups: [],
        removed_groups: [encodeRoleGroup(groupMapping)],
      };
      const body = {
        orgId: session ? session.orgId : null,
        role: roleName,
        param: patchBody,
        session: session,
      };

      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.PATCH,
      };

      const res = await fetch(`/api/settings/role/patchGroupMapping`, request);
      const data = await res.json();
      return data;
    } catch (err) {
      return null;
    }
  }

  return (
    <Modal
      backdrop="static"
      role="alertdialog"
      open={open}
      onClose={onClose}
      size="sm"
    >
      <Modal.Header>
        <Modal.Title>
          <h4>Are you sure you want to delete the group Mapping?</h4>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, form, submitting, pristine, errors }) => (
            <FormSuite layout="vertical" onSubmit={onSubmit} fluid>
              <FormButtonToolbar
                submitButtonText="Delete"
                submitButtonDisabled={false}
                onCancel={onClose}
              />
            </FormSuite>
          )}
        />
      </Modal.Body>
      <div style={loadingDisplay}>
        <Loader
          size="lg"
          backdrop
          content="Group Mapping is deleteing"
          vertical
        />
      </div>
    </Modal>
  );
}
