import { requestOptionsWithBody } from "../../../../../utils/api-util/api-request-options";
import RequestMethod from "../../../../../models/api/requestMethod";
import { getOrgUrl } from "../../../../../utils/application-config-util/application-config-util";
import { NextApiRequest, NextApiResponse } from "next";
import { dataNotRecievedError } from "../../../../../utils/api-util/api-errors";

/**
 * backend API call to edit a user
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns correct data if the call is successful, else an error message
 */
export default async function editUser(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PATCH") {
        dataNotRecievedError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const user = body.param;
    const orgId = body.orgId;

    const id = req.query.id;

    try {
        const fetchData = await fetch(
            `${getOrgUrl(orgId)}/scim2/Users/${id}`,
            requestOptionsWithBody(session, RequestMethod.PATCH, user)
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
        res.status(200).json(data);
    } catch (err) {

        return dataNotRecievedError(res);
    }
}
