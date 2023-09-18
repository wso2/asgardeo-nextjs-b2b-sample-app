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

import { getHostedUrl } from "../application-config-util/application-config-util";
import RequestMethod from "../../models/api/requestMethod";
import { Session } from "next-auth";

/**
 * 
 * @param session - session object
 * 
 * @returns header object that can used for Asgardeo API calls
 */
export function requestOptions(session: Session): RequestInit {
    return apiRequestOptions(session, getHostedUrl());
}

export function requestOptionsWithBody(session: Session, method: RequestMethod, body: BodyInit | null): RequestInit {
    return apiRequestOptionsWithBody(session, method, body, getHostedUrl());
}

/**
 * 
 * @param session - session object
 * 
 * @returns header object that can used for Asgardeo API calls
 */
export function apiRequestOptions(session: Session, hostedUrl: string): RequestInit {
    const headers = {
        "accept": "application/json",
        "access-control-allow-origin": hostedUrl,
        "authorization": "Bearer " + session.accessToken
    };

    return { headers };
}

function apiRequestOptionsWithDataHeader(session: Session, hostedUrl: string): HeadersInit {
    const headers = {
        ...apiRequestOptions(session, hostedUrl).headers,
        "content-type": "application/json"
    };

    return headers;
}

export function apiRequestOptionsWithBody(session: Session, method: RequestMethod, body: BodyInit | null, hostedUrl: string)
    : RequestInit {
    const request = {
        body: JSON.stringify(body),
        headers: apiRequestOptionsWithDataHeader(session, hostedUrl),
        method: method
    };

    return request;
}
