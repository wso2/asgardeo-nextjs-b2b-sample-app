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

import { dataNotRecievedError } from "../../../utils/api-util/api-errors";
import { requestOptions } from "../../../utils/api-util/api-request-options"
import { NextApiRequest, NextApiResponse } from "next";

/**
 * backend API call to external api call
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function getProfileInfo(req: NextApiRequest, res: NextApiResponse) {

  
    if (req.method !== "POST") {
        dataNotRecievedError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;

    try {
        const fetchData = await fetch(
            `https://4b3606a5-0c21-401e-853c-8d72b4ea20ea-prod.e1-us-east-azure.choreoapis.dev/qovt/sampleapi/endpoint-9090-803/1.0.0/accounts`,
            requestOptions(session)
        );
        const data = await fetchData.json();

        if (fetchData.status >= 200 && fetchData.status < 300) {
            res.status(fetchData.status).json(data);
        } else {
            return res.status(fetchData.status).json({
                error: true,
                msg: data.detail
            })
        }    } catch (err) {
        return dataNotRecievedError(res);
    }
}
