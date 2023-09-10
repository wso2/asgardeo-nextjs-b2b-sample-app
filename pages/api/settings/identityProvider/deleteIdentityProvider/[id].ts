import { requestOptionsWithBody } from "../../../../../utils/api-util/api-request-options";
import RequestMethod from "../../../../../models/api/requestMethod";
import { getOrgUrl } from "../../../../../utils/application-config-util/application-config-util";
import { dataNotRecievedError } from "../../../../../utils/api-util/api-errors";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * backend API call to delete an identity provider
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function deleteIdentityProvider(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        dataNotRecievedError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;
    const id = req.query.id;

    try {
        const fetchData = await fetch(
            `${getOrgUrl(orgId)}/api/server/v1/identity-providers/${id}`,
            requestOptionsWithBody(session, RequestMethod.DELETE, null)
        );

        res.status(200).json(fetchData);
    } catch (err) {
        
        return dataNotRecievedError(res);
    }
}
