import { Group, InternalGroup } from "../models/group/group";

/**
 * 
 * @param group - (group object return from the IS)
 * 
 * @returns group object that can be view in front end side
 */
export function decodeGroup(group: Group): InternalGroup {

    const displayName = group.displayName?.split("/")?.[1] || "-";
    const userstore = group.displayName?.split("/")?.[0] || "-";

    return {
        "displayName": displayName,
        "id": group.id ? group.id : "-",
        "userStore": userstore
    };
}

