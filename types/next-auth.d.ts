import { User } from "./../models/user/user";
import { Profile } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        error: boolean,
        expires: boolean,
        accessToken?: string,
        idToken?: JWT,
        scope?: string,
        refreshToken?: string,
        userId?: string,
        user?: User | null,
        orgId?: string,
        orgName?: string,
        orginalIdToken?: string,
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        idToken?: string,
        accessToken?: string,
        scope?: string,
        user?: Profile
    }
}

declare module "next-auth" {
    interface Profile {
        email?: string,
        sub?: string,
        family_name?: string,
        given_name?: string,
        username?: string,
        user_organization?: string,
        org_name?: string,
        org_id: string
    }
}