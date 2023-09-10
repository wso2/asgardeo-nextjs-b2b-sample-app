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
  prop: GoogleIdentityProviderProps
) {
  const { session, template, onIdpCreate, onCancel } = prop;

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
