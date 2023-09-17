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

import { Session } from "next-auth";
import { Form } from "react-final-form";
import { Modal, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import { IdentityProviderGroupInterface } from "../../../../../../models/identityProvider/identityProvider";
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../../../common/DialogComponent/DialogComponent";
import RequestMethod from "../../../../../../models/api/requestMethod";
import FormButtonToolbar from "../../../../../common/UIBasicComponents/FormButtonToolbar/FormButtonToolbar";

interface IdpGroupDeleteProps {
  session: Session;
  id: string;
  open: boolean;
  onClose: () => void;
  groups: IdentityProviderGroupInterface[];
  getGroups: () => Promise<void>;
}

/**
 *
 * @param prop - session, user (user details), open (whether the modal open or close), onClose (on modal close)
 *
 * @returns Modal form to delete the group
 */
export default function IdpGroupDelete(prop: IdpGroupDeleteProps) {
  const { session, id, open, onClose, groups, getGroups } = prop;
  const toaster = useToaster();

  const onGroupDelete = (
    response: IdentityProviderGroupInterface[] | null
  ): void => {
    if (response) {
      successTypeDialog(toaster, "Success", "Idp Group Deleted Successfully");
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while deleting the Group. Try again."
      );
    }
  };

  const onSubmit = (): void => {
    deleteIdentityProviderGroups(session, id, groups)
      .then((response) => onGroupDelete(response))
      .finally(() => {
        getGroups().finally();
      });

    onClose();
  };

  async function deleteIdentityProviderGroups(
    session: Session,
    id: string,
    groups: IdentityProviderGroupInterface[]
  ): Promise<IdentityProviderGroupInterface[] | null> {
    try {
      const body = [groups];

      const requestBody = {
        orgId: session ? session.orgId : null,
        param: body,
        session: session,
      };
      const request = {
        body: JSON.stringify(requestBody),
        method: RequestMethod.POST,
      };

      const res = await fetch(
        `/api/settings/identityProvider/updateIdentityProviderGroups/${id}`,
        request
      );

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
          <h4>Are you sure you want to delete the group?</h4>
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
    </Modal>
  );
}
