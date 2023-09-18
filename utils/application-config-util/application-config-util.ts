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

/**
 * 
 * @param orgId - organization id
 * 
 * @returns organization url
 */
export function getOrgUrl(orgId: string): string {

    const managementAPIServerBaseUrl = getManagementAPIServerBaseUrl();

    return `${managementAPIServerBaseUrl}/o/${orgId}`;
}

export function getMeEnpointUrl(orgId: string): string {

    const managementAPIServerBaseUrl = getManagementAPIServerBaseUrl();

    return `${managementAPIServerBaseUrl}/t/${orgId}`;
}

export function getUrl(orgId: string): string {
    return `${getHostedUrl()}/o/${orgId}`;
}

export function getRolesEnpointUrl(orgId: string): string {

    const baseUrl = "https://api.authz.cloudservices.wso2.com";
    // eslint-disable-next-line
    const matches = baseUrl.match(/^(http|https)?\:\/\/([^\/?#]+)/i);
    const domain = matches && matches[0];
    return `${domain}/o/${orgId}`;
}

/**
 * URL extracted from the `config.AuthorizationConfig.BaseOrganizationUrl`
 * 
 * @returns managemnt API server base URL
 */

export function getManagementAPIServerBaseUrl() {

    // todo: implementation will change after changes are done to the IS.

    const baseOrganizationUrl = `${process.env.NEXT_PUBLIC_ASGARDEO_BASE_ORGANIZATION_URL}`;
    // eslint-disable-next-line
    const matches = baseOrganizationUrl!.match(/^(http|https)?\:\/\/([^\/?#]+)/i);
    const domain = matches && matches[0];

    return domain;
}

/**
 * Tenant domain extracted from the `config.AuthorizationConfig.BaseOrganizationUrl`
 * 
 *  @returns tenatn domain.
 */
export function getTenantDomain() {

    const baseOrganizationUrl = `${process.env.NEXT_PUBLIC_ASGARDEO_BASE_ORGANIZATION_URL}`;
    const url = baseOrganizationUrl.split("/");
    const path = url[url.length - 1];

    return path;
}

/**
 * get hosted url
 * value of `config.ApplicationConfig.HostedUrl`
 */
export function getHostedUrl() : string {

    return process.env.NEXT_PUBLIC_HOSTED_URL!;
}

