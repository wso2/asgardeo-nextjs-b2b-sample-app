import { requestOptionsWithBody } from "../../../../utils/api-util/api-request-options";
import { getRolesEnpointUrl } from "../../../../utils/application-config-util/application-config-util";
import { NextApiRequest, NextApiResponse } from "next";
import RequestMethod from "../../../../models/api/requestMethod";
import { dataNotRecievedError } from "../../../../utils/api-util/api-errors";

export default async function PatchGroupMappings(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "PATCH") {
        dataNotRecievedError(res);
    }

    const body = JSON.parse(req.body);
    const session = body.session;
    const orgId = body.orgId;
    const patchBody = body.param;
    const name = body.role;
    const appId = body.appId

    try {
       
        const fetchData = await fetch(
            `${getRolesEnpointUrl(orgId)}/applications/${appId}/roles/${name}/group-mapping`,
            requestOptionsWithBody(session, RequestMethod.PATCH, patchBody)
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
