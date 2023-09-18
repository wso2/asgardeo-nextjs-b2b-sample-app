/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). 
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

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

