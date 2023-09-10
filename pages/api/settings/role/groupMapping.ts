import { requestOptions } from "../../../../utils/api-util/api-request-options";
import { getRolesEnpointUrl } from "../../../../utils/application-config-util/application-config-util";
import { NextApiRequest, NextApiResponse } from "next";
import { dataNotRecievedError } from "../../../../utils/api-util/api-errors";

export default async function GroupMapping(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        dataNotRecievedError(res);
    }
    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;
    const appId = body.appId;

    const name = body.role;

    try {
        const fetchData = await fetch(
            `${getRolesEnpointUrl(orgId)}/applications/${appId}/roles/${name}/group-mapping`,
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
