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
