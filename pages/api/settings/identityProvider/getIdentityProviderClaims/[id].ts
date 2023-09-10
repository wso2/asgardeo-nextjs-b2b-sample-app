import { dataNotRecievedError } from "../../../../../utils/api-util/api-errors";
import { requestOptions } from "../../../../../utils/api-util/api-request-options";
import { getOrgUrl } from "../../../../../utils/application-config-util/application-config-util";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * backend API call to get federtated authenticator claims of an identity provider
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function getIdentityProviderClaims(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        dataNotRecievedError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;

    const id = req.query.id;

    const url = `${getOrgUrl(orgId)}/api/server/v1/identity-providers/${id}/claims`;
    try {
        const fetchData = await fetch(
            url,
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
