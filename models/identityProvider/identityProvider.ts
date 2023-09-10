interface FederatedAuthenticatorForIdentityProvider {
    defaultAuthenticatorId : string,
    authenticators: IdentityProviderFederatedAuthenticator
    [key: string]: unknown,
}

export interface IdentityProviderFederatedAuthenticator {
    authenticatorId?: string,
    tags?: string[],
    properties: IdentityProviderFederatedAuthenticatorProperty[],
    [key: string]: unknown
}

export interface IdentityProvider{
    id: string,
    name: string,
    image : string,
    description : string,
    federatedAuthenticators?: FederatedAuthenticatorForIdentityProvider,
    templateId: string,
    groups?: IdentityProviderGroupInterface[];
    [key: string]: unknown,
}

export interface IdentityProviderList {
    count: number
    identityProviders: IdentityProvider[]
    totalResults: number,
    [key: string]: unknown
}

export enum IdentityProviderConfigureType {
    MANUAL = "manual",
    AUTO = "auto"
}

export interface IdentityProviderDiscoveryUrl {
    authorization_endpoint: string,
    token_endpoint: string,
    end_session_endpoint: string,
    jwks_uri: string
}

export interface IdentityProviderFederatedAuthenticatorProperty {
    key: string,
    value: string
}

export interface IdentityProviderTemplate {
    id?: string,
	idp?: IdentityProviderTemplateModel,
	templateId?: string,
    name: string,
    description? : string,
    [key: string] : unknown
}

export interface IdentityProviderTemplateModelAuthenticatorProperty {
    key?: string,
    value?: string,
    displayName?: string,
    readOnly?: boolean,
    description?: string,
    [key: string]: unknown
}

interface IdentityProviderTemplateModelAuthenticator {
    authenticatorId: string,
    isEnabled: boolean,
    properties: IdentityProviderTemplateModelAuthenticatorProperty[],
    [key: string]: unknown
}

interface IdentityProviderTemplateModelFederatedAuthenticator {
    authenticators: IdentityProviderTemplateModelAuthenticator[],
    defaultAuthenticatorId: string,
    [key: string]: unknown
}

interface IdentityProviderTemplateModelCertificate {
    jwksUri?: string,
    certificates?: string[]
}

export interface IdentityProviderTemplateModel {
    name: string,
    image?: string,
    alias?: string,
    certificate?: IdentityProviderTemplateModelCertificate,
    federatedAuthenticators?: IdentityProviderTemplateModelFederatedAuthenticator,
    [key: string]: unknown

}

export interface IdentityProviderClaimsInterface {
    userIdClaim?: IdentityProviderClaimInterface;
    roleClaim?: IdentityProviderClaimInterface;
    mappings?: IdentityProviderClaimMappingInterface[];
    provisioningClaims?: IdentityProviderProvisioningClaimInterface[];
}

export interface IdentityProviderClaimInterface {
    id?: string;
    uri: string;
    displayName?: string;
}

export interface IdentityProviderClaimMappingInterface {
    idpClaim: string;
    localClaim: IdentityProviderClaimInterface;
}

export interface IdentityProviderProvisioningClaimInterface {
    claim: IdentityProviderClaimInterface;
    defaultValue: string;
}

/**
 * Interface for Identity Provider Group.
 */
export interface IdentityProviderGroupInterface {
    id: string;
    name: string;
}

export interface AuthenticatorInterface {

    id: string;
    name: string;
    description?: string;
    displayName: string;
    isEnabled: boolean;
    type: AuthenticatorTypes;
    image?: string;
    tags: string[];
    self: string;
}

export enum AuthenticatorTypes {
    FEDERATED = "FEDERATED",
    LOCAL = "LOCAL"
}



