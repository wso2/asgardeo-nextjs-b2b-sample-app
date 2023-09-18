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
import { Checkbox, CheckboxGroup, Panel, Stack, useToaster } from "rsuite";
import {
  AuthenticatorInterface,
  IdentityProvider,
  IdentityProviderGroupInterface,
} from "../../../../../../../models/identityProvider/identityProvider";
import AccordionItemHeaderComponent from "../../../../../../common/AccordianItemHeader/AccordianItemHeader";
import { useCallback, useEffect, useState } from "react";
import RequestMethod from "../../../../../../../models/api/requestMethod";
import { Form } from "react-final-form";
import FormSuite from "rsuite/Form";
import FormField from "../../../../../../common/UIBasicComponents/FormField/FormField";
import FormButtonToolbar from "../../../../../../common/UIBasicComponents/FormButtonToolbar/FormButtonToolbar";
import {
  PatchGroupMapping,
  RoleGroup,
} from "../../../../../../../models/role/role";
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../../../../common/DialogComponent/DialogComponent";
import { ApiError } from "../../../../../../../utils/api-util/api-errors";

interface AuthenticatorGroupProps {
  session: Session;
  authenticator: AuthenticatorInterface;
  roleName: string;
  appId: string;
}

/**
 *
 * @param prop - session, authenticator, roleName
 *
 * @returns Authenticator Group componet
 */
export default function AuthenticatorGroup(props: AuthenticatorGroupProps) {
  const { session, authenticator, roleName, appId } = props;

  const [idpGroups, setIdpGroups] = useState<IdentityProviderGroupInterface[]>(
    []
  );

  const [initialAssigneGroups, setInitialAssignedGroups] = useState<string[]>(
    []
  );
  const toaster = useToaster();

  const fetchData = useCallback(async () => {
    const res: IdentityProvider = (await getDetailedIdentityProvider(
      session,
      authenticator.id
    )) as IdentityProvider;
    await setIdpGroups(res.groups!);
  }, [session]);

  const fetchIdpGroups = useCallback(async () => {
    const res: RoleGroup[] = (await getIdpAssignedGroups(
      session,
      roleName,
      authenticator.id
    )) as RoleGroup[];
    if (res) {
      setInitialAssignedGroups(getInitialAssignedGroupNames(res));
    }
  }, [session]);

  const getInitialAssignedGroupNames = (groups: RoleGroup[]): string[] => {
    if (groups) {
      return groups.map((group) => group.name || "");
    }
    return [];
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchIdpGroups();
  }, []);

  async function getDetailedIdentityProvider(
    session: Session,
    id: string
  ): Promise<IdentityProvider | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch(
        `/api/settings/identityProvider/getDetailedIdentityProvider/${id}`,
        request
      );
      const data = await res.json();

      return data;
    } catch (err) {
      return null;
    }
  }

  async function getIdpAssignedGroups(
    session: Session,
    name: string,
    id: string
  ): Promise<RoleGroup[] | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        param: name,
        appId: appId,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };
      const res = await fetch(
        `/api/settings/role/getIdpAssignedGroups/${id}`,
        request
      );
      const data = await res.json();
      return data.groups;
    } catch (err) {
      return null;
    }
  }

  const onSubmit = async (
    values: Record<string, string>,
    form: any
  ): Promise<void> => {
    patchIdpGroups(session, roleName, values.groups.toString().split(","))
      .then((response) => onDataSubmit(response, form))
      .finally(() => {
        fetchIdpGroups().finally();
      });
  };
  const onDataSubmit = (
    response: RoleGroup[] | ApiError | null,
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
        successTypeDialog(toaster, "Changes Saved Successfully.");
      }
    } else {
      errorTypeDialog(toaster, "Error Occured. Try again.");
    }
  };

  async function patchIdpGroups(
    session: Session,
    roleName: string,
    patchGroups: string[]
  ): Promise<RoleGroup[] | ApiError | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        param: roleName,
        appId: appId,
        patchBody: getPatchgroups(patchGroups),
        session: session,
      };

      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch(
        `/api/settings/role/patchIdpAssignedGroups/${authenticator.id}`,
        request
      );
      const data = await res.json();
      return data;
    } catch (err) {
      return null;
    }
  }

  function getPatchgroups(patchGroups: string[]): PatchGroupMapping {
    const added_groups: RoleGroup[] = [];
    const removed_groups: RoleGroup[] = [];

    for (const group of patchGroups) {
      if (!initialAssigneGroups.includes(group)) {
        added_groups.push({
          name: group,
        });
      }
    }

    for (const group of initialAssigneGroups) {
      if (!patchGroups.includes(group)) {
        removed_groups.push({
          name: group,
        });
      }
    }

    const patchBody: PatchGroupMapping = {
      added_groups: added_groups,
      removed_groups: removed_groups,
    };
    return patchBody;
  }

  return authenticator ? (
    <Panel
      header={
        <AccordionItemHeaderComponent
          title={authenticator.displayName}
          description={""}
        />
      }
    >
      <div className={"addUserMainDiv"}>
        {idpGroups && idpGroups.length > 0 ? (
          <Form
            onSubmit={onSubmit}
            initialValues={{
              groups: initialAssigneGroups,
            }}
            render={({ handleSubmit, form, submitting, pristine }) => (
              <FormSuite
                layout="vertical"
                onSubmit={() => {
                  handleSubmit();
                }}
                fluid
              >
                <FormField name="groups" label="" needErrorMessage={false}>
                  <FormSuite.Control name="checkbox" accepter={CheckboxGroup}>
                    {idpGroups.map((group) => (
                      <Checkbox key={group.id} value={group.name}>
                        {group.name}
                      </Checkbox>
                    ))}
                  </FormSuite.Control>
                </FormField>

                <FormButtonToolbar
                  submitButtonText="Assign Groups"
                  needCancel={false}
                  submitButtonDisabled={submitting || pristine}
                />
              </FormSuite>
            )}
          />
        ) : (
          <Stack alignItems="center" direction="column">
            <p style={{ fontSize: 14, marginTop: "20px" }}>
              {"There are no groups available to assign to this role."}
            </p>
          </Stack>
        )}
      </div>
    </Panel>
  ) : null;
}
