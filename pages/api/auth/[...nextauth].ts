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

import { getLoggedUserFromProfile, getLoggedUserId, getOrgId, getOrgName  } from "../../../utils/authorization-config-util/authorization-config-util";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";
import OrgSession from "../../../models/orgSession/orgSession";
import { getHostedUrl } from "../../../utils/application-config-util/application-config-util";
import RequestMethod from "../../../models/api/requestMethod";

/**
 * 
 * @param req - request body
 * @param res - response body
 * 
 * @returns IS provider that will handle the sign in process. Used in `orgSignin()`
 * [Use this method to signin]
 */
const wso2ISProvider = (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, {

    callbacks: {

        async jwt({ token, account, profile }) {

            if (account) {
                token.accessToken = account.access_token;
                token.idToken = account.id_token;
                token.scope = account.scope;
                token.user = profile;
            }
            return token;
        },
        async redirect({ baseUrl }) {
            return `${baseUrl}/o/moveOrg`;
        },
        async session({ session, token }) {
            const orgSession = await switchOrg(token);

            if (!orgSession) {
                session.error = true;
            } else if (orgSession.expires_in <= 0) {
                session.expires = true;
            }
            else {
                session.accessToken = orgSession.access_token;
                session.idToken = orgSession.id_token;
                session.scope = orgSession.scope;
                session.refreshToken = orgSession.refresh_token;
                session.expires = false;
                session.userId = getLoggedUserId(session.idToken!);
                session.user = getLoggedUserFromProfile(token.user!);
                session.orgId = getOrgId(session.idToken!);
                session.orgName = getOrgName(session.idToken!);
                session.orginalIdToken = token.idToken;
            }
            return session;
        
        }
    },
    debug: true,
    providers: [
        {
            authorization: {
                params: {
                    scope:  "openid email profile internal_login internal_user_mgt_view internal_user_mgt_list internal_user_mgt_update internal_user_mgt_delete internal_user_mgt_create internal_idp_view internal_idp_create internal_idp_update internal_idp_delete internal_application_mgt_view internal_application_mgt_update internal_application_mgt_create internal_application_mgt_delete internal_organization_view internal_role_mgt_view internal_role_mgt_create internal_role_mgt_update internal_role_mgt_delete internal_group_mgt_update internal_group_mgt_view internal_group_mgt_create internal_group_mgt_delete internal_governance_view internal_governance_update"
                }
            },
            clientId: process.env.SHARED_APP_CLIENT_ID,
            clientSecret: process.env.SHARED_APP_CLIENT_SECRET,
            id: "wso2isAdmin",
            name: "WSO2ISAdmin",
            profile(profile) {

                return {
                    id: profile.sub
                };
            },
            type: "oauth",
            userinfo: `${process.env.NEXT_PUBLIC_ASGARDEO_BASE_ORGANIZATION_URL}/oauth2/userinfo`,
            // eslint-disable-next-line
            wellKnown: `${process.env.NEXT_PUBLIC_ASGARDEO_BASE_ORGANIZATION_URL}/oauth2/token/.well-known/openid-configuration`,

            issuer: `${process.env.NEXT_PUBLIC_ASGARDEO_BASE_ORGANIZATION_URL}/oauth2/token`
        }
    ],
    secret: process.env.SECRET
});

/**
 * 
 * @param token - token object get from the inital login call
 * 
 * @returns - organization id of the logged in organization
 */
async function switchOrg(token: JWT): Promise<OrgSession | null> {

    try {

    const subOrgId: string = getOrganizationId(token);
    const accessToken: string = (token.accessToken as string);

    const body = {
                param: accessToken,
                subOrgId: subOrgId
            };
    const request = {
                body: JSON.stringify(body),
                method: RequestMethod.POST
            };
    
    const res = await fetch(`${getHostedUrl()}/api/settings/switchOrg`, request);
    const data = await res.json();
    return data;
    
    } catch (err) {

        return null;
    }

}

function getOrganizationId(token: JWT): string {

    if(token.user) {
        if (token.user.user_organization) {

            return token.user.user_organization;
        } else if (process.env.SUB_ORGANIZATION_ID) {
    
            return process.env.SUB_ORGANIZATION_ID;
        } else {
    
            return token.user.org_id;
        }
    } else {
        
        return process.env.SUB_ORGANIZATION_ID!;
    }

}


export default wso2ISProvider;
