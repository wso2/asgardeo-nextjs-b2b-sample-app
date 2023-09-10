import { NextApiResponse } from "next";

export interface ApiError {
    error: boolean,
    msg: string
}

function error500(res: NextApiResponse, msg: ApiError | string) {

    return res.status(500).json(msg);
}
export function dataNotRecievedError(res: NextApiResponse) {

    return error500(res, {
        error: true,
        msg: "Error occured when requesting data."
    });
}
