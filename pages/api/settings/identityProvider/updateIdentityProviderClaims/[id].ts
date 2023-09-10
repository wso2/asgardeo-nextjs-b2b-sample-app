import { requestOptionsWithBody } from "../../../../../utils/api-util/api-request-options";
import RequestMethod from "../../../../../models/api/requestMethod";
import { getOrgUrl } from "../../../../../utils/application-config-util/application-config-util";    
import { NextApiRequest, NextApiResponse } from "next";
import { dataNotRecievedError } from "../../../../../utils/api-util/api-errors";

/**
 * backend API call to update claims of an identity provider
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function updateIdentityProviderClaims(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        dataNotRecievedError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;
    const request = body.param;
    const idpId = req.query.id;

    const url = `${getOrgUrl(orgId)}/api/server/v1/identity-providers/${idpId}` +
        `/claims`;

    try {
        const fetchData = await fetch(
            url,
            requestOptionsWithBody(session, RequestMethod.PUT, request[0])
        );
        const data = await fetchData.json();
        if (fetchData.status >= 200 && fetchData.status < 300) {
            res.status(fetchData.status).json(data);
        } else {
            return res.status(fetchData.status).json({
                error: true,
                msg: data.detail
            })
        }
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
