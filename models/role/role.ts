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

