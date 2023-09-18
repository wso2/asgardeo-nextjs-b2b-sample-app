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

export type Name = {
    givenName: string,
    familyName: string
}

export interface User {
    id: string | undefined,
    name: Name,
    emails: string[] | undefined,
    userName: string | undefined,
    [key: string]: unknown
}

export interface UserList {
    Resources?: User[] 
    itemsPerPage: number,
    schemas: string[],
    startIndex:number, 
    totalResults: number
}

export interface Email {
    primary: boolean,
    value: string
}

interface UrnSchema {
    askPassword : string
}

export interface SendUser {
    emails: [Email],
    name : Name,
    "urn:scim:wso2:schema"? : UrnSchema,
    userName : string,
    schemas? : [],
    password? : string
}

interface Operation {
    op: string,
    value : {
        emails : [Email],
        name : Name,
        userName : string,
    }
}

export interface SendEditUser {
    Operations: [Operation],
    schemas: [string]
}

export interface InternalUser {
    email: string | undefined,
    familyName: string,
    firstName: string,
    id: string,
    username: string
}
