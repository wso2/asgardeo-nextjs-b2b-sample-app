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

import { getHostedUrl } from "../../../utils/application-config-util/application-config-util";
import { NextApiRequest, NextApiResponse } from "next";
import { dataNotRecievedError } from "../../../utils/api-util/api-errors";

/**
 * 
 * @returns get the basic auth for authorize the switch call
 */
const getBasicAuth = (): string => Buffer
    // eslint-disable-next-line
    .from(`${process.env.SHARED_APP_CLIENT_ID}:${process.env.SHARED_APP_CLIENT_SECRET}`).toString("base64");

/**
 * 
 * @returns get the header for the switch call
 */
const getSwitchHeader = (): HeadersInit => {

    const headers = {
        "Access-Control-Allow-Credentials": true.toString(),
        "Access-Control-Allow-Origin": getHostedUrl(),
        Authorization: `Basic ${getBasicAuth()}`,
        accept: "application/json",
        "content-type": "application/x-www-form-urlencoded"
    };

    return headers;
};

/**
 * 
 * @param subOrgId - sub organization id
 * @param accessToken - access token return from the IS
 * 
 * @returns get the body for the switch call
 */
const getSwitchBody = (subOrgId: string, accessToken: string): Record<string, string> => {
    
    const body = {
        "grant_type": "organization_switch",
        "scope": "openid email profile internal_login internal_user_mgt_view internal_user_mgt_list " +
            "internal_user_mgt_update internal_user_mgt_delete internal_user_mgt_create internal_idp_view " +
            "internal_idp_create internal_idp_update internal_idp_delete internal_application_mgt_view " +
            "internal_application_mgt_update internal_application_mgt_create internal_application_mgt_delete " +
            "internal_organization_view internal_role_mgt_view internal_role_mgt_create internal_role_mgt_update " +
            "internal_role_mgt_delete internal_group_mgt_update internal_group_mgt_view internal_group_mgt_create " +
            "internal_group_mgt_delete internal_governance_view internal_governance_update",
        "switching_organization": subOrgId,
        "token": accessToken
    };

    return body;
};

/**
 * 
 * @param subOrgId - sub organization id
 * @param accessToken - access token return from the IS
 * 
 * @returns get the request body for the switch call
 */
const getSwitchRequest = (subOrgId: string, accessToken: string): RequestInit => {
    const request = {
        body: new URLSearchParams(getSwitchBody(subOrgId, accessToken)).toString(),
        headers: getSwitchHeader(),
        method: "POST"
    };

    return request;
};

/**
 * 
 * @returns get the endpoint for the switch API call
 */
const getSwitchEndpoint = (): string => `${process.env.NEXT_PUBLIC_ASGARDEO_BASE_ORGANIZATION_URL}/oauth2/token`;

/**
 * 
 * @param req - request object
 * @param res - response object
 * 
 * @returns whether the switch call was successful
 */
export default async function switchOrg(req: NextApiRequest, res: NextApiResponse) {

    if (req.method !== "POST") {
        dataNotRecievedError(res);
    }

    const body = JSON.parse(req.body);
    const subOrgId = body.subOrgId;
    const accessToken = body.param;

    try {

        const fetchData = await fetch(
            getSwitchEndpoint(),
            getSwitchRequest(subOrgId, accessToken)
        );

        const data = await fetchData.json();

        res.status(200).json(data);
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
