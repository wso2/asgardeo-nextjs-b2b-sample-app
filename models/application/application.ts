export interface Application {
    id: string,
    name: string,
    description: string,
    authenticationSequence: AuthenticationSequence,
    [key: string]: unknown;
}

export interface ApplicationList {
    totalResults: number,
    applications: Application[],
    [key: string]: unknown,
}

export interface AuthenticationSequenceModel {
    authenticationSequence: AuthenticationSequence
}

export interface AuthenticationSequenceStep {
    id: number,
    options: AuthenticationSequenceStepOption[]
}

export interface AuthenticationSequence {
    attributeStepId: number,
    requestPathAuthenticators?: string[],
    steps: AuthenticationSequenceStep[],
    subjectStepId: number,
    type: string
}

export interface AuthenticationSequenceStepOption {
    idp: string,
    authenticator: string
}

export interface ApplicationAuthenticatorInterface {
    idp: string;
    authenticator: string;
}
