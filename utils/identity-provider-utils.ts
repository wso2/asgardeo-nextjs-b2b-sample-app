import enterpriseImage from "../images/enterprise.svg";
import googleImage from "../images/google.svg";
import { IdentityProviderDiscoveryUrl, IdentityProviderTemplateModel } from "../models/identityProvider/identityProvider";
import { getManagementAPIServerBaseUrl, getOrgUrl } from "./application-config-util/application-config-util";
import { EMPTY_STRING, ENTERPRISE_ID, GOOGLE_ID } from "./util-common/common";

/**
 * @param templateId - template id of the identity provider

 * @returns - local image for the relevant identity provider
 */
export function getImageForTheIdentityProvider(templateId: string): string {
    if (GOOGLE_ID === templateId) {

        return googleImage;
    }
    if (ENTERPRISE_ID === templateId) {

        return enterpriseImage;

    }

    return EMPTY_STRING;
}

/**
 * 
 * @returns callBackUrl of the idp
 */
export function getCallbackUrl(orgId: string): string {
    return `${getOrgUrl(orgId)}/commonauth`;
}

/**
 * 
 * @param model - template of the idp as a JSON
 * @param templateId - identity provider template id
 * @param formValues - values get from the form inputs
 * @param orgId - organization id
 * 
 * @returns - idp readay to sent to the IS 
 */
export function setIdpTemplate(model: IdentityProviderTemplateModel, templateId: string,
    formValues: Record<string, string>, orgId: string,
    identityProviderDiscoveryUrl?: IdentityProviderDiscoveryUrl): IdentityProviderTemplateModel {

    const name: string = formValues["application_name"].toString();
    const clientId: string = formValues["client_id"].toString();
    const clientSecret: string = formValues["client_secret"].toString();

    model.name = name;

    switch (templateId) {
        case GOOGLE_ID:
            model = googleIdpTemplate(model, clientId, clientSecret, orgId);

            break;
        case ENTERPRISE_ID:
            model = enterpriseIdpTemplate(model, clientId, clientSecret, formValues, orgId,
                identityProviderDiscoveryUrl);

            break;
        default:
            break;
    }

    model.federatedAuthenticators!.authenticators[0].isEnabled = true;

    return model;

}

/**
 * 
 * @param model - template of the idp as a JSON
 * @param clientId - client id text entered by the user for the identity provider
 * @param clientSecret - client secret text entered by the user for the identity provider
 * @param orgId - organization id
 * 
 * @returns - create google IDP template
 */
export function googleIdpTemplate(model: IdentityProviderTemplateModel, clientId: string, clientSecret: string,
    orgId: string): IdentityProviderTemplateModel {

    model.image = "/libs/themes/default/assets/images/identity-providers/google-idp-illustration.svg";

    model.alias = `${getManagementAPIServerBaseUrl()}/oauth2/token`;

    model.federatedAuthenticators!.authenticators[0].properties = [
        {
            "key": "ClientId",
            "value": clientId
        },
        {
            "key": "ClientSecret",
            "value": clientSecret
        },
        {
            "key": "callbackUrl",
            "value": getCallbackUrl(orgId)
        },
        {
            "key": "Scopes",
            "value": "email openid profile"
        }
    ];

    return model;
}

/**
 * 
 * @param model - template of the idp as a JSON
 * @param clientId - client id text entered by the user for the identity provider
 * @param clientSecret - client secret text entered by the user for the identity provider    
 * @param formValues - values get from the form inputs
 * @param orgId - organization id
 * 
 * @returns create enterprise IDP template
 */
export function enterpriseIdpTemplate(model: IdentityProviderTemplateModel, clientId: string, clientSecret: string,
    formValues: Record<string, string>, orgId: string, identityProviderDiscoveryUrl?: IdentityProviderDiscoveryUrl)
    : IdentityProviderTemplateModel {

    let authorizationEndpointUrl: string;
    let tokenEndpointUrl: string;
    let logoutUrl: string;
    let jwksUri: string;

    if (identityProviderDiscoveryUrl) {
        authorizationEndpointUrl = identityProviderDiscoveryUrl.authorization_endpoint;
        tokenEndpointUrl = identityProviderDiscoveryUrl.token_endpoint;
        logoutUrl = identityProviderDiscoveryUrl.end_session_endpoint;
        jwksUri = identityProviderDiscoveryUrl.jwks_uri;
    } else {
        authorizationEndpointUrl = formValues["authorization_endpoint"].toString();
        tokenEndpointUrl = formValues["token_endpoint"].toString();
        logoutUrl ="";
        jwksUri="";
        if (formValues["end_session_endpoint"]) {
            logoutUrl = formValues["end_session_endpoint"].toString();
        }

        if (formValues["jwks_uri"]) {
            jwksUri = formValues["jwks_uri"].toString();
        }
    }

    model.image = "/libs/themes/default/assets/images/identity-providers/enterprise-idp-illustration.svg";

    model.federatedAuthenticators!.authenticators[0].properties = [
        {
            "key": "ClientId",
            "value": clientId
        },
        {
            "key": "ClientSecret",
            "value": clientSecret
        },
        {
            "key": "OAuth2AuthzEPUrl",
            "value": authorizationEndpointUrl
        },
        {
            "key": "OAuth2TokenEPUrl",
            "value": tokenEndpointUrl
        },
        {
            "key": "OIDCLogoutEPUrl",
            "value": logoutUrl
        },
        {
            "key": "callbackUrl",
            "value": getCallbackUrl(orgId)
        },
        {
            "key": "Scopes",
            "value": "email openid profile"
        }
    ];

    model.certificate!.jwksUri = jwksUri;

    return model;
}
