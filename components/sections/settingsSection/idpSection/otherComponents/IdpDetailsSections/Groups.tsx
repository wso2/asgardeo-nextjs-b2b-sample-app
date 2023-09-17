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
import {
  IdentityProvider,
  IdentityProviderClaimMappingInterface,
  IdentityProviderClaimsInterface,
} from "../../../../../../models/identityProvider/identityProvider";
import RequestMethod from "../../../../../../models/api/requestMethod";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-final-form";
import FormSuite from "rsuite/Form";
import FormButtonToolbar from "../../../../../common/UIBasicComponents/FormButtonToolbar/FormButtonToolbar";
import { checkIfJSONisEmpty } from "../../../../../../utils/util-common/common";
import FormField from "../../../../../common/UIBasicComponents/FormField/FormField";
import { fieldValidate } from "../../../../../../utils/front-end-util/frontend-util";
import GroupsList from "./GroupsList";
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../../../common/DialogComponent/DialogComponent";
import { useToaster } from "rsuite";

interface GroupsProps {
  session: Session;
  idpDetails: IdentityProvider;
}

export default function Groups(props: GroupsProps) {
  const { session, idpDetails } = props;
  const [idpClaims, setIdpClaims] =
    useState<IdentityProviderClaimsInterface | null>();
  const [groupAttribute, setGroupAttribute] = useState<string>("");
  const toaster = useToaster();

  const fetchData = useCallback(async () => {
    const res: IdentityProviderClaimsInterface | null =
      await getIdentityProviderClaims(session, idpDetails.id);

    await setIdpClaims(res);
  }, [session, idpDetails.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!idpClaims) {
      return;
    }

    setGroupAttribute(getGroupAttribute());
  }, [idpClaims]);

  const getGroupAttribute = (): string => {
    if (idpClaims!.mappings!.length > 0) {
      const groupAttribute: IdentityProviderClaimMappingInterface | undefined =
        idpClaims!.mappings!.find(
          (claim: IdentityProviderClaimMappingInterface) => {
            return claim.localClaim.uri === "http://wso2.org/claims/groups";
          }
        );

      if (groupAttribute) {
        return groupAttribute.idpClaim;
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  async function getIdentityProviderClaims(
    session: Session,
    id: string
  ): Promise<IdentityProviderClaimsInterface | null> {
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
        `/api/settings/identityProvider/getIdentityProviderClaims/${id}`,
        request
      );

      const data = await res.json();
      return data;
    } catch (err) {
      return null;
    }
  }

  const onUpdate = async (
    values: Record<string, string>,
    form: any
  ): Promise<void> => {
    if (values.groupAttribute.trim()) {
      const mappedAttribute: IdentityProviderClaimsInterface = {
        ...idpClaims,
        mappings: [
          {
            idpClaim: values.groupAttribute.trim(),
            localClaim: {
              uri: "http://wso2.org/claims/groups",
            },
          },
        ],
        roleClaim: {
          uri: "",
        },
        userIdClaim: {
          uri: "",
        },
      };

      idpClaims!.mappings?.forEach(
        (claim: IdentityProviderClaimMappingInterface) => {
          if (claim.localClaim.uri === "http://wso2.org/claims/username") {
            mappedAttribute!.mappings!.push(claim);
            mappedAttribute.userIdClaim = idpClaims!.userIdClaim;
          }

          if (claim.localClaim.uri === "http://wso2.org/claims/role") {
            mappedAttribute!.mappings!.push(claim);
            mappedAttribute.roleClaim = idpClaims!.roleClaim;
          }
        }
      );

      addIdentityProviderClaims(session, idpDetails.id, mappedAttribute)
        .then((response) => onDataSubmit(response))
        .finally(() => fetchData());
    }
  };

  const onDataSubmit = (
    response: IdentityProviderClaimsInterface | null
  ): void => {
    if (response) {
      successTypeDialog(
        toaster,
        "Changes Saved Successfully",
        "Group added to the organization successfully."
      );
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while adding the group. Try again."
      );
    }
  };

  async function addIdentityProviderClaims(
    session: Session,
    id: string,
    claims: IdentityProviderClaimsInterface
  ): Promise<IdentityProviderClaimsInterface | null> {
    try {
      const body = [claims];

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
        `/api/settings/identityProvider/updateIdentityProviderClaims/${id}`,
        request
      );

      const data = await res.json();
      return data;
    } catch (err) {
      return null;
    }
  }

  const validate = (
    values: Record<string, unknown>
  ): Record<string, string> => {
    let errors: Record<string, string> = {};

    errors = fieldValidate("groupAttribute", values.groupAttribute, errors);
    return errors;
  };

  return (
    <div className={"addUserMainDiv"}>
      <div>
        <Form
          onSubmit={onUpdate}
          validate={validate}
          initialValues={{
            groupAttribute: groupAttribute,
          }}
          render={({ handleSubmit, submitting, pristine, errors }) => (
            <FormSuite
              layout="vertical"
              className={"addUserForm"}
              onSubmit={() => handleSubmit()}
              fluid
            >
              <FormField
                name="groupAttribute"
                label="Group attribute"
                helperText="The attribute from the Connection that will be mapped to the organization's group attribute. This should be defined for the attribute from the Connection to be returned."
                needErrorMessage={true}
              >
                <FormSuite.Control name="input" />
              </FormField>

              <FormButtonToolbar
                submitButtonText="Update"
                submitButtonDisabled={
                  submitting || pristine || !checkIfJSONisEmpty(errors)
                }
                needCancel={false}
              />
            </FormSuite>
          )}
        />
      </div>
      <GroupsList session={session} idpId={idpDetails.id} />
    </div>
  );
}
