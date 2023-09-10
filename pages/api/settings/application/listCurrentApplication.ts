import { requestOptions } from "../../../../utils/api-util/api-request-options";
import { getOrgUrl } from "../../../../utils/application-config-util/application-config-util";
import { NextApiRequest, NextApiResponse } from "next";
import { dataNotRecievedError } from "../../../../utils/api-util/api-errors";

/**
 * API call to get the initial details of the current application. Use the application name to filter out the 
 * application (`config.ManagementAPIConfig.SharedApplicationName`).
 * 
 * @param req - request
 * @param res - response
 * 
 * @returns initial details of the current application
 */
export default async function listCurrentApplication(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        dataNotRecievedError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;

    const appName = process.env.SHARED_APPICATION_NAME;

    try {
        const fetchData = await fetch(
            `${getOrgUrl(orgId)}/api/server/v1/applications?filter=name+eq+${appName}`,
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
        }

    } catch (err) {

        return dataNotRecievedError(res);
    }
}
