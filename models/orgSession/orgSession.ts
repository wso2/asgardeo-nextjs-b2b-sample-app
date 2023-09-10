import { JWT } from "next-auth/jwt";

export interface OrgSession {
    access_token?: string
    scope?: string,
    id_token?: JWT,
    refresh_token?: string,
    token_type?: string,
    expires_in: number
}

export default OrgSession;
