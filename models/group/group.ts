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

export interface Group {
    displayName: string;
    meta: Meta;
    id: string;
}

export interface Meta {
    created: string;
    location: string;
    lastModified: string;
}

export interface GroupList {
    totalResults: number;
    startIndex: number;
    itemsPerPage: number;
    schemas: string[];
    Resources: Group[];
}

export interface InternalGroup {
    displayName: string,
    userStore: string,
    id: string
}

interface Operation {
    op: string,
    value : sendMemberList,
}

export interface sendMemberList {
    members: Member[]
}

export interface SendEditGroupMembers {
    Operations: [Operation],
    schemas: [string]
}

interface EditGroupNameOperation {
    op: string,
    path: string,
    value : string
}

export interface SendEditGroupName {
    Operations: [EditGroupNameOperation],
    schemas: [string]
}

export interface Member {
    display: string;
    value: string;
}
  
export interface SendGroup {
    displayName: string;
    members: Member[];
    schemas: string[];
}

interface AddedGroupMeta {
    created: string;
    location: string;
    lastModified: string;
    resourceType: string;
}
  
interface AddedGroupMember {
    display: string;
    value: string;
}
  
export interface AddedGroup {
    displayName: string;
    meta: AddedGroupMeta;
    schemas: string[];
    members: AddedGroupMember[];
    id: string;
}

interface UpdatedMeta {
    created: string;
    location: string;
    lastModified: string;
  }
  
  interface UpdatedMember {
    display: string;
    value: string;
    $ref: string;
  }
  
export interface UpdatedGroup {
    displayName: string;
    meta: UpdatedMeta;
    schemas: string[];
    members: UpdatedMember[];
    id: string;
  }
