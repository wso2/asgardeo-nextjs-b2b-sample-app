import { InternalRoleGroup, RoleGroup } from "../models/role/role";

/**
 * 
 * @param group - (group object return from the IS)
 * 
 * @returns group object that can be view in front end side
 */
export function decodeRoleGroup(group: RoleGroup): InternalRoleGroup {

    const name = group.name?.split("/")?.[1] || "-";
    const userstore = group.name?.split("/")?.[0] || "-";

    return {
        "name": name,
        "userstore": userstore
    };
}

export function encodeRoleGroup(group: InternalRoleGroup): RoleGroup {

    const name = group.userstore + "/" + group.name;
    return {
        "name":name
    }

}

