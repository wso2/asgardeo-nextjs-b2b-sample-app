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
