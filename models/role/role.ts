/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

type Permission = {
    name: string;
  };

export interface Role {
    name: string,
    permissions?: Permission[]
}

interface PaginationLink {
    rel?: string,
    href?: string
}

export interface RoleList {
    PaginationLink: PaginationLink,
    Resources: Role[],
}

export interface RoleGroup {
    name: string,
}

export interface RoleGroupList {
    name: string,
    groups: RoleGroup[],
}

export interface InternalRoleGroup {
    name: string,
    userstore: string
}

export interface PatchGroupMapping {
    added_groups: RoleGroup[],
    removed_groups: RoleGroup[],
}

