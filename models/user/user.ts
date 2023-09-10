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
