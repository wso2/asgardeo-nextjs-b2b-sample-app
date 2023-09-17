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

import FormButtonToolbar from "../../../../../common/UIBasicComponents/FormButtonToolbar/FormButtonToolbar";
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../../../common/DialogComponent/DialogComponent";
import {
  LOADING_DISPLAY_BLOCK,
  LOADING_DISPLAY_NONE,
} from "../../../../../../utils/front-end-util/frontend-util";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Form } from "react-final-form";
import { Loader, Toaster, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import SettingsFormSelection from "./SettingsFormSection/SettingsFormSelection";
import { checkIfJSONisEmpty } from "../../../../../../utils/util-common/common";
import RequestMethod from "../../../../../../models/api/requestMethod";
import {
  IdentityProvider,
  IdentityProviderFederatedAuthenticator,
} from "../../../../../../models/identityProvider/identityProvider";

interface SettingsProps {
  session: Session;
  idpDetails: IdentityProvider;
}

/**
 *
 * @param prop - session, idpDetails
 *
 * @returns The settings section of an idp
 */
export default function Settings(props: SettingsProps) {
  const { session, idpDetails } = props;

  const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);
  const [federatedAuthenticators, setFederatedAuthenticators] =
    useState<IdentityProviderFederatedAuthenticator | null>();

  const toaster: Toaster = useToaster();

  const fetchData = useCallback(async () => {
    const res = await getFederatedAuthenticators(
      session,
      idpDetails.id,
      idpDetails.federatedAuthenticators!.defaultAuthenticatorId
    );

    await setFederatedAuthenticators(res);
  }, [session, idpDetails]);

  async function getFederatedAuthenticators(
    session: Session,
    id: string,
    idpId: string
  ): Promise<IdentityProviderFederatedAuthenticator | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        param: idpId,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };
      const res = await fetch(
        `/api/settings/identityProvider/getFederatedAuthenticators/${id}`,
        request
      );
      const data = await res.json();

      return data;
    } catch (err) {
      return null;
    }
  }

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const validate = () => {
    const errors: Record<string, string> = {};

    if (federatedAuthenticators && federatedAuthenticators.properties) {
      federatedAuthenticators.properties.filter((property) => {
        if (document.getElementById(property.key)) {
          if (
            !(document.getElementById(property.key) as HTMLInputElement).value
          ) {
            errors[property.key] = "This field cannot be empty";
          }
        }
      });
    }

    return errors;
  };

  const onDataSubmit = (
    response: IdentityProviderFederatedAuthenticator | null
  ): void => {
    if (response) {
      successTypeDialog(
        toaster,
        "Changes Saved Successfully",
        "Idp updated successfully."
      );
      fetchData();
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while updating the Idp. Try again."
      );
    }
  };

  const onUpdate = async (values: Record<string, string>): Promise<void> => {
    setLoadingDisplay(LOADING_DISPLAY_BLOCK);
    updateFederatedAuthenticators(
      session,
      idpDetails.id,
      federatedAuthenticators!,
      values
    )
      .then((response) => onDataSubmit(response))
      .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
  };

  async function updateFederatedAuthenticators(
    session: Session,
    idpId: string,
    federatedAuthenticators: IdentityProviderFederatedAuthenticator,
    changedValues: Record<string, string>
  ): Promise<IdentityProviderFederatedAuthenticator | null> {
    try {
      const federatedAuthenticatorId = federatedAuthenticators.authenticatorId;

      federatedAuthenticators = refactorFederatedAuthenticatorsForUpdate(
        federatedAuthenticators
      );
      Object.keys(changedValues).filter((key) => {
        federatedAuthenticators = updateProperties(
          federatedAuthenticators,
          key,
          changedValues[key]
        );

        return null;
      });

      const body = [federatedAuthenticatorId, federatedAuthenticators];
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
        `/api/settings/identityProvider/updateFederatedAuthenticators/${idpId}`,
        request
      );
      const data = await res.json();
      return data;
    } catch (err) {
      return null;
    }
  }

  function refactorFederatedAuthenticatorsForUpdate(
    federatedAuthenticators: IdentityProviderFederatedAuthenticator
  ) {
    delete federatedAuthenticators.authenticatorId;
    delete federatedAuthenticators.tags;

    return federatedAuthenticators;
  }

  function updateProperties(
    federatedAuthenticators: IdentityProviderFederatedAuthenticator,
    keyProperty: string,
    valueProperty: string
  ) {
    federatedAuthenticators.properties.filter(
      (property) => property.key === keyProperty
    )[0].value = valueProperty;

    return federatedAuthenticators;
  }

  return (
    <div className={"addUserMainDiv"}>
      <div>
        {federatedAuthenticators ? (
          <Form
            onSubmit={onUpdate}
            validate={validate}
            render={({ handleSubmit, submitting, pristine, errors }) => (
              <FormSuite
                layout="vertical"
                className={"addUserForm"}
                onSubmit={() => handleSubmit()}
                fluid
              >
                {federatedAuthenticators.properties ? (
                  <SettingsFormSelection
                    federatedAuthenticators={federatedAuthenticators.properties}
                    templateId={idpDetails.templateId}
                  />
                ) : null}

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
        ) : null}
      </div>

      <div style={loadingDisplay}>
        <Loader size="lg" backdrop content="User is adding" vertical />
      </div>
    </div>
  );
}
