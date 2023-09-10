import FormButtonToolbar from "../../../../../common/UIBasicComponents/FormButtonToolbar/FormButtonToolbar";
import FormField from "../../../../../common/UIBasicComponents/FormField/FormField";
import { checkIfJSONisEmpty } from "../../../../../../utils/util-common/common";
import { fieldValidate } from "../../../../../../utils/front-end-util/frontend-util";
import { Session } from "next-auth";
import { useState } from "react";
import { Form } from "react-final-form";
import { Loader, Radio, RadioGroup } from "rsuite";
import FormSuite from "rsuite/Form";
import { setIdpTemplate } from "../../../../../../utils/identity-provider-utils";
import {
  IdentityProvider,
  IdentityProviderConfigureType,
  IdentityProviderDiscoveryUrl,
  IdentityProviderTemplate,
  IdentityProviderTemplateModel,
} from "../../../../../../models/identityProvider/identityProvider";
import RequestMethod from "../../../../../../models/api/requestMethod";
import { ValueType } from "rsuite/esm/Radio";

interface ExternalIdentityProviderProps {
  session: Session;
  template: IdentityProviderTemplate;
  onIdpCreate: (response: IdentityProvider | null) => void;
  onCancel: () => void;
}

/**
 *
 * @param prop - `ExternalIdentityProviderProps`
 *
 * @returns Form to create external idp
 */
export default function ExternalIdentityProvider(
  prop: ExternalIdentityProviderProps
) {
  const { session, template, onIdpCreate, onCancel } = prop;

  const [configureType, setConfigureType] =
    useState<IdentityProviderConfigureType>(IdentityProviderConfigureType.AUTO);

  const validate = (values: Record<string, string>): Record<string, string> => {
    let errors: Record<string, string> = {};

    errors = fieldValidate("application_name", values.application_name, errors);
    errors = fieldValidate("client_id", values.client_id, errors);
    errors = fieldValidate("client_secret", values.client_secret, errors);

    switch (configureType) {
      case IdentityProviderConfigureType.AUTO:
        errors = fieldValidate("discovery_url", values.discovery_url, errors);

        break;

      case IdentityProviderConfigureType.MANUAL:
        errors = fieldValidate(
          "authorization_endpoint",
          values.authorization_endpoint,
          errors
        );
        errors = fieldValidate("token_endpoint", values.token_endpoint, errors);

        break;
    }

    return errors;
  };

  const onConfigureTypeChange = (value: ValueType): void => {
    setConfigureType(value as IdentityProviderConfigureType);
  };

  const onUpdate = async (
    values: Record<string, string>,
    form: any
  ): Promise<void> => {
    controllerDecodeCreateIdentityProvider(
      session,
      template,
      values,
      configureType
    )
      .then((response) => onIdpCreate(response))
      .finally(() => form.restart);
  };

  async function controllerDecodeCreateIdentityProvider(
    session: Session,
    template: IdentityProviderTemplate,
    formValues: Record<string, string>,
    configureType?: IdentityProviderConfigureType
  ): Promise<IdentityProvider | null> {
    try {
      let model: IdentityProviderTemplateModel = JSON.parse(
        JSON.stringify(template.idp)
      );

      if (configureType) {
        switch (configureType) {
          case IdentityProviderConfigureType.AUTO: {
            const identityProviderDiscoveryUrl: IdentityProviderDiscoveryUrl | null =
              await getIdentityProviderFromDiscoveryUrl(
                session,
                formValues["discovery_url"].toString()
              );

            if (identityProviderDiscoveryUrl) {
              model = setIdpTemplate(
                model,
                template.templateId as string,
                formValues,
                session.orgId as string,
                identityProviderDiscoveryUrl
              );
            }

            break;
          }

          case IdentityProviderConfigureType.MANUAL: {
            model = setIdpTemplate(
              model,
              template.templateId as string,
              formValues,
              session.orgId as string
            );

            break;
          }
        }
      }

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

  /**
   * get the identity provider details from the discovery url
   *
   * @param discoveryUrl - discovery url
   */
  async function getIdentityProviderFromDiscoveryUrl(
    session: Session,
    discoveryUrl: string
  ): Promise<IdentityProviderDiscoveryUrl | null> {
    const body = {
      orgId: session ? session.orgId : null,
      param: discoveryUrl,
      session: session,
    };
    const request = {
      body: JSON.stringify(body),
      method: RequestMethod.POST,
    };
    const res = await fetch(
      "/api/settings/identityProvider/getDiscoveryUrl",
      request
    );
    const data = await res.json();

    return data;
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
            <RadioGroup
              name="radioList"
              value={configureType as IdentityProviderConfigureType}
              onChange={onConfigureTypeChange}
            >
              <Radio value={IdentityProviderConfigureType.AUTO}>
                Use the discovery url to configure the identity provider
              </Radio>
              <Radio value={IdentityProviderConfigureType.MANUAL}>
                Manually configure the identity provider
              </Radio>
            </RadioGroup>
            <br />
            {configureType === IdentityProviderConfigureType.AUTO ? (
              <>
                <FormField
                  name="discovery_url"
                  label="Discovery URL"
                  helperText="Discovery URL of the identity provider."
                  needErrorMessage={true}
                >
                  <FormSuite.Control name="input" type="url" />
                </FormField>
              </>
            ) : null}

            {configureType === IdentityProviderConfigureType.MANUAL ? (
              <>
                <FormField
                  name="authorization_endpoint"
                  label="Authorization Endpoint URL"
                  helperText="Authorization Endpoint URL of the identity provider."
                  needErrorMessage={true}
                >
                  <FormSuite.Control name="input" type="url" />
                </FormField>
                <FormField
                  name="token_endpoint"
                  label="Token Endpoint URL"
                  helperText="Token Endpoint URL of the identity provider."
                  needErrorMessage={true}
                >
                  <FormSuite.Control name="input" type="url" />
                </FormField>
                <FormField
                  name="end_session_endpoint"
                  label="Logout URL (optional)"
                  // eslint-disable-next-line
                  helperText="The URL of the identity provider to which Asgardeo will send session invalidation requests."
                  needErrorMessage={true}
                >
                  <FormSuite.Control name="input" type="url" />
                </FormField>
                <FormField
                  name="jwks_uri"
                  label="JWKS endpoint URL (optional)"
                  helperText="JWKS endpoint URL of the identity provider."
                  needErrorMessage={true}
                >
                  <FormSuite.Control name="input" type="url" />
                </FormField>
              </>
            ) : null}
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
