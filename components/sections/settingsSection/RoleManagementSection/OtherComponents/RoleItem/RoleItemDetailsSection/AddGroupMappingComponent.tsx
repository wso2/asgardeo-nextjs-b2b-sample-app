/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com).
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
import FormField from "../../../../../../common/UIBasicComponents/FormField/FormField";
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../../../../common/DialogComponent/DialogComponent";
import { Session } from "next-auth";
import { useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Checkbox, Loader, Modal, Table, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import {
  InternalRoleGroup,
  PatchGroupMapping,
  RoleGroup,
  RoleGroupList,
} from "../../../../../../../models/role/role";
import { InternalGroup } from "../../../../../../../models/group/group";
import RequestMethod from "../../../../../../../models/api/requestMethod";
import { encodeRoleGroup } from "../../../../../../../utils/role-utils";
import { RowDataType } from "rsuite/esm/Table";
import { ApiError } from "../../../../../../../utils/api-util/api-errors";
import {
  LOADING_DISPLAY_BLOCK,
  LOADING_DISPLAY_NONE,
} from "../../../../../../../utils/front-end-util/frontend-util";

interface AddGroupMappingComponentProps {
  session: Session;
  roleGroups: InternalRoleGroup[] | [];
  groups: InternalGroup[] | [];
  roleName: string;
  appId: string;
  open: boolean;
  onClose: () => void;
  getGroups: () => Promise<void>;
}

/**
 *
 * @param prop - session, open (whether modal open or close), onClose (on modal close)
 *
 * @returns Modal to add a group.
 */
export default function AddGroupMappingComponent(
  props: AddGroupMappingComponentProps
) {
  const {
    session,
    roleGroups,
    groups,
    roleName,
    appId,
    open,
    onClose,
    getGroups,
  } = props;
  const [newGroups, setNewGroups] = useState<InternalGroup[]>([]);
  const [checkedGroups, setCheckedGroups] = useState<InternalGroup[]>([]);
  const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);

  const { Column, HeaderCell, Cell } = Table;

  const toaster = useToaster();

  const onDataSubmit = (
    response: RoleGroupList | ApiError | null,
    form: any
  ): void => {
    if (response) {
      if ((response as ApiError).error) {
        errorTypeDialog(
          toaster,
          "Error Occured",
          (response as ApiError).msg as string
        );
      } else {
        successTypeDialog(
          toaster,
          "Changes Saved Successfully",
          "Group added to the organization successfully."
        );
        form.restart();
        onClose();
      }
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while adding the group. Try again."
      );
    }
    setCheckedGroups([]);
  };

  useEffect(() => {
    setCheckedGroups([]);
  }, []);

  useEffect(() => {
    removeExistingRoles();
  }, []);

  const onSubmit = async (
    values: Record<string, string>,
    form: any
  ): Promise<void> => {
    setLoadingDisplay(LOADING_DISPLAY_BLOCK);
    patchGroupMappings(session, roleName, getSendGroupData(checkedGroups))
      .then((response) => onDataSubmit(response, form))
      .finally(() => {
        setLoadingDisplay(LOADING_DISPLAY_NONE);
        getGroups().finally();
      });
    onClose();
  };

  async function patchGroupMappings(
    session: Session,
    roleName: string,
    groupMapping: InternalRoleGroup[]
  ): Promise<RoleGroupList | ApiError | null> {
    try {
      const patchBody: PatchGroupMapping = {
        added_groups: getEncodedRoleGroups(groupMapping),
        removed_groups: [],
      };

      const body = {
        orgId: session ? session.orgId : null,
        role: roleName,
        param: patchBody,
        appId: appId,
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

  function getEncodedRoleGroups(
    internalRoleGroup: InternalRoleGroup[]
  ): RoleGroup[] {
    const roleGroup: RoleGroup[] = [];
    internalRoleGroup.map((group) => {
      roleGroup.push(encodeRoleGroup(group));
    });
    return roleGroup;
  }

  const removeExistingRoles = () => {
    const addedGroups: InternalGroup[] = [];

    groups.map((group) => {
      roleGroups.map((roleGroup) => {
        if (roleGroup.name === group.displayName) {
          addedGroups.push(group);
        }
      });
    });
    const remainingGroups = groups.filter(
      (group: InternalGroup) => !addedGroups?.includes(group)
    );
    setNewGroups(remainingGroups);
  };

  return (
    <Modal
      backdrop="static"
      role="alertdialog"
      open={open}
      onClose={onClose}
      size="sm"
    >
      <Modal.Body>
        <div className={"addUserMainDiv"}>
          <Form
            onSubmit={onSubmit}
            render={({ handleSubmit, form, submitting, pristine }) => (
              <FormSuite
                layout="vertical"
                onSubmit={() => {
                  handleSubmit();
                }}
                fluid
              >
                <FormField
                  name="addGroup"
                  label="Assign Groups"
                  helperText="Select groups to assign them to the role."
                  type="checkbox"
                >
                  <Table autoHeight data={newGroups}>
                    <Column width={500} align="left">
                      <HeaderCell>
                        <h6>Groups</h6>
                      </HeaderCell>
                      <Cell dataKey="displayName">
                        {(rowData: RowDataType<InternalGroup>) => {
                          return (
                            <Checkbox
                              onChange={(
                                value: any,
                                checked: boolean,
                                event: React.SyntheticEvent<HTMLInputElement>
                              ) => {
                                if (checked) {
                                  setCheckedGroups((prevGroups) => [
                                    ...prevGroups,
                                    rowData as InternalGroup,
                                  ]);
                                } else {
                                  setCheckedGroups((prevGroups) =>
                                    prevGroups.filter(
                                      (group) => group !== rowData
                                    )
                                  );
                                }
                              }}
                            >
                              {rowData.displayName}
                            </Checkbox>
                          );
                        }}
                      </Cell>
                    </Column>
                  </Table>
                </FormField>
                <br />
                <FormButtonToolbar
                  submitButtonText="Submit"
                  submitButtonDisabled={submitting || pristine}
                  onCancel={onClose}
                />
              </FormSuite>
            )}
          />
        </div>
      </Modal.Body>
      <div style={loadingDisplay}>
        <Loader size="md" backdrop content="" vertical />
      </div>
    </Modal>
  );
}

function getSendGroupData(groups: InternalGroup[]) {
  const roleGroup: InternalRoleGroup[] = groups.map((group) => ({
    name: group.displayName,
    userstore: group.userStore,
  }));
  return roleGroup;
}
