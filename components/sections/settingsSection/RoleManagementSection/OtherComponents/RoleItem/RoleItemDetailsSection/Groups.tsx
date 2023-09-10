import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import TrashIcon from "@rsuite/icons/Trash";
import { Button, Table, useToaster } from "rsuite";
import DeleteGroupMappingComponent from "./DeleteGroupMappingComponent";
import AddGroupMappingComponent from "./AddGroupMappingComponent";
import RequestMethod from "../../../../../../../models/api/requestMethod";
import {
  InternalRoleGroup,
  Role,
  RoleGroup,
} from "../../../../../../../models/role/role";
import { Group, InternalGroup } from "../../../../../../../models/group/group";
import { decodeGroup } from "../../../../../../../utils/group-utils";
import { decodeRoleGroup } from "../../../../../../../utils/role-utils";

interface GroupProps {
  session: Session;
  roleDetails: Role;
  appId: string;
}

/**
 *
 * @param prop - session, roleDetails
 *
 * @returns The groups section of role details
 */
export default function Groups(props: GroupProps) {
  const { session, roleDetails, appId } = props;

  const [groupMappings, setGroupMappings] = useState<
    InternalRoleGroup[] | null
  >();
  const [deleteGroupMappingOpen, setDeleteGroupMappingOpen] =
    useState<boolean>(false);
  const [openGroup, setOpenGroup] = useState<InternalRoleGroup | null>();
  const [addGroupMappingOpen, setAddGroupMappingOpen] =
    useState<boolean>(false);
  const [groups, setGroups] = useState<InternalGroup[] | null>([]);
  const { Column, HeaderCell, Cell } = Table;

  const fetchAllGroupMappings = useCallback(async () => {
    const res = await getGroupMappings(session, roleDetails.name);
    await setGroupMappings(res);
  }, [session]);

  async function getGroupMappings(
    session: Session,
    name: string
  ): Promise<InternalRoleGroup[] | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        role: name,
        appId: appId,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };
      const res = await fetch(`/api/settings/role/groupMapping`, request);
      const data = await res.json();
      if (data) {
        const groupsReturn: InternalRoleGroup[] = [];

        if (data.groups) {
          data.groups.map((group: RoleGroup) => {
            const groupDetails = decodeRoleGroup(group);

            if (groupDetails) {
              groupsReturn.push(groupDetails);
            }

            return null;
          });
        }

        return groupsReturn;
      }

      return null;
    } catch (err) {
      return null;
    }
  }

  const fetchGroups = useCallback(async () => {
    const res = await viewGroups(session);
    await setGroups(res);
  }, [session]);

  async function viewGroups(session: Session): Promise<InternalGroup[] | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };
      const res = await fetch("/api/settings/group/viewGroups", request);
      const groupsData = await res.json();

      if (groupsData) {
        const groupsReturn: InternalGroup[] = [];

        if (groupsData.Resources) {
          groupsData.Resources.map((group: Group) => {
            const groupDetails = decodeGroup(group);
            if (groupDetails) {
              groupsReturn.push(groupDetails);
            }
            return null;
          });
        }
        return groupsReturn;
      }
      return null;
    } catch (err) {
      return null;
    }
  }

  useEffect(() => {
    fetchAllGroupMappings();
  }, [fetchAllGroupMappings]);

  useEffect(() => {
    fetchGroups();
  }, []);

  const onAddClick = (): void => {
    setAddGroupMappingOpen(true);
  };

  const onDeleteClick = (roleGroup: InternalRoleGroup): void => {
    setOpenGroup(roleGroup);
    setDeleteGroupMappingOpen(true);
  };

  const closeAddGroupMappingDialog = (): void => {
    setAddGroupMappingOpen(false);
  };

  const closeDeleteDialog = (): void => {
    setOpenGroup(null);
    setDeleteGroupMappingOpen(false);
  };

  return (
    <div className={"addUserMainDiv"}>
      {deleteGroupMappingOpen ? (
        <DeleteGroupMappingComponent
          session={session}
          open={deleteGroupMappingOpen}
          onClose={closeDeleteDialog}
          roleName={roleDetails.name}
          group={openGroup!}
          getGroups={fetchAllGroupMappings}
        />
      ) : null}

      {addGroupMappingOpen ? (
        <AddGroupMappingComponent
          session={session}
          roleGroups={groupMappings!}
          groups={groups!}
          roleName={roleDetails.name}
          appId={appId}
          open={addGroupMappingOpen}
          onClose={closeAddGroupMappingDialog}
          getGroups={fetchAllGroupMappings}
        />
      ) : null}
      <div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            size="sm"
            appearance="primary"
            style={{ borderRadius: "50px" }}
            onClick={onAddClick}
          >
            Assign Groups
          </Button>
        </div>
        {groupMappings ? (
          <div style={{ height: "900", overflow: "auto" }}>
            <Table autoHeight data={groupMappings}>
              <Column width={200}>
                <HeaderCell>
                  <h6>Group</h6>
                </HeaderCell>
                <Cell dataKey="name" />
              </Column>

              <Column width={200}>
                <HeaderCell>
                  <h6>User Store</h6>
                </HeaderCell>
                <Cell dataKey="userstore" />
              </Column>

              <Column flexGrow={1} fixed="right">
                <HeaderCell>
                  <h6></h6>
                </HeaderCell>

                <Cell>
                  {(rowData) => (
                    <span>
                      <a
                        onClick={() =>
                          onDeleteClick(rowData as InternalRoleGroup)
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <TrashIcon />
                      </a>
                    </span>
                  )}
                </Cell>
              </Column>
            </Table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
