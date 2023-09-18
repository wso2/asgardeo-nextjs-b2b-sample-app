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
import FormField from "../../../../../common/UIBasicComponents/FormField/FormField";
import { checkIfJSONisEmpty } from "../../../../../../utils/util-common/common";
import { fieldValidate } from "../../../../../../utils/front-end-util/frontend-util";
import { Session } from "next-auth";
import { Form } from "react-final-form";
import { Loader } from "rsuite";
import FormSuite from "rsuite/Form";
import { setIdpTemplate } from "../../../../../../utils/identity-provider-utils";
import {
  IdentityProvider,
  IdentityProviderTemplate,
  IdentityProviderTemplateModel,
} from "../../../../../../models/identityProvider/identityProvider";
import RequestMethod from "../../../../../../models/api/requestMethod";

interface GoogleIdentityProviderProps {
  session: Session;
  template: IdentityProviderTemplate;
  onIdpCreate: (response: IdentityProvider | null) => void;
  onCancel: () => void;
}

/**
 *
 * @param prop - `GoogleIdentityProviderProps`
 *
 * @returns Form to create google idp
 */
export default function GoogleIdentityProvider(
  props: GoogleIdentityProviderProps
) {
  const { session, template, onIdpCreate, onCancel } = props;

  const validate = (values: Record<string, string>): Record<string, string> => {
    let errors: Record<string, string> = {};

    errors = fieldValidate("application_name", values.application_name, errors);
    errors = fieldValidate("client_id", values.client_id, errors);
    errors = fieldValidate("client_secret", values.client_secret, errors);

    return errors;
  };

  const onUpdate = async (
    values: Record<string, string>,
    form: any
  ): Promise<void> => {
    createGoogleIdentityProvider(session, template, values)
      .then((response) => onIdpCreate(response))
      .finally(() => form.restart);
  };

  async function createGoogleIdentityProvider(
    session: Session,
    template: IdentityProviderTemplate,
    formValues: Record<string, string>
  ): Promise<IdentityProvider | null> {
    try {
      let model: IdentityProviderTemplateModel = JSON.parse(
        JSON.stringify(template.idp)
      );

      model = setIdpTemplate(
        model,
        template.templateId as string,
        formValues,
        session.orgId as string
      );

      const body = {
        orgId: session ? session.orgId : null,
        param: model,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch(
        "/api/settings/identityProvider/createIdentityProvider",
        request
      );
      const data = await res.json();

      return data;
    } catch (err) {
      return null;
    }
  }

  return (
    <div>
      <Form
        onSubmit={onUpdate}
        validate={validate}
        render={({ handleSubmit, form, submitting, pristine, errors }) => (
          <FormSuite
            layout="vertical"
            className={"addUserForm"}
            onSubmit={() => {
              handleSubmit();
            }}
            fluid
          >
            <FormField
              name="application_name"
              label="Name"
              needErrorMessage={true}
            >
              <FormSuite.Control name="input" />
            </FormField>
            <FormField
              name="client_id"
              label="Client Id"
              needErrorMessage={true}
            >
              <FormSuite.Control name="input" />
            </FormField>
            <FormField
              name="client_secret"
              label="Client Secret"
              needErrorMessage={true}
            >
              <FormSuite.Control name="input" />
            </FormField>
            <FormButtonToolbar
              submitButtonText="Create"
              submitButtonDisabled={
                submitting || pristine || !checkIfJSONisEmpty(errors)
              }
              onCancel={onCancel}
            />
          </FormSuite>
        )}
      />
    </div>
  );
}
