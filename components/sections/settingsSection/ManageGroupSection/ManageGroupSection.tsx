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

import EditIcon from "@rsuite/icons/Edit";
import TrashIcon from "@rsuite/icons/Trash";
import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import { Button, Loader, Stack, Table } from "rsuite";
import { InternalUser, User } from "../../../../models/user/user";
import { Group, InternalGroup } from "../../../../models/group/group";
import RequestMethod from "../../../../models/api/requestMethod";
import { decodeGroup } from "../../../../utils/group-utils";
import { decodeUser } from "../../../../utils/user-utils";
import { useSession } from "next-auth/react";
import {
  LOADING_DISPLAY_BLOCK,
  LOADING_DISPLAY_NONE,
} from "../../../../utils/front-end-util/frontend-util";
import AddGroup from "./OtherComponents/AddGroup";
import DeleteGroup from "./OtherComponents/DeleteGroup";
import EditGroup from "./OtherComponents/EditGroup";

/**
 *
 *
 * @returns A component that will show the groups in a table view
 */
export default function ManageGroupSection() {
  const { data: session, status } = useSession();

  const [users, setUsers] = useState<InternalUser[] | null>([]);
  const [groups, setGroups] = useState<InternalGroup[] | null>([]);
  const [editGroupOpen, setEditGroupOpen] = useState<boolean>(false);
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [openGroup, setOpenGroup] = useState<InternalGroup | null>();
  const [deleteUserOpen, setDeleteUserOpen] = useState<boolean>(false);
  const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);
  const { Column, HeaderCell, Cell } = Table;

  const fetchData = useCallback(async () => {
    setLoadingDisplay(LOADING_DISPLAY_BLOCK);
    const res = await getGroups(session!);
    await setGroups(res);
    setLoadingDisplay(LOADING_DISPLAY_NONE);
  }, [session]);

  async function getGroups(session: Session): Promise<InternalGroup[] | null> {
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

  const fetchAllUsers = useCallback(async () => {
    const res = await getUsersList(session!);
    await setUsers(res);
  }, [session]);

  async function getUsersList(
    session: Session
  ): Promise<InternalUser[] | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch("/api/settings/user/viewUsers", request);
      const usersData = await res.json();

      if (usersData) {
        const usersReturn: InternalUser[] = [];

        if (usersData.Resources) {
          usersData.Resources.map((user: User) => {
            const userDetails = decodeUser(user);

            if (userDetails) {
              usersReturn.push(userDetails);
            }

            return null;
          });
        }

        return usersReturn;
      }
      return usersData;
    } catch (err) {
      return null;
    }
  }

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  useEffect(() => {
    if (!editGroupOpen || !addUserOpen || !deleteUserOpen) {
      fetchData();
    }
  }, [editGroupOpen, addUserOpen, deleteUserOpen, fetchData]);

  const closeEditDialog = (): void => {
    setOpenGroup(null);
    setEditGroupOpen(false);
  };

  const closeDeleteDialog = (): void => {
    setOpenGroup(null);
    setDeleteUserOpen(false);
  };

  const onEditClick = (group: InternalGroup): void => {
    setOpenGroup(group);
    setEditGroupOpen(true);
  };

  const onDeleteClick = (group: InternalGroup): void => {
    setOpenGroup(group);
    setDeleteUserOpen(true);
  };

  const closeAddUserDialog = (): void => {
    setAddUserOpen(false);
  };

  const onAddUserClick = (): void => {
    setAddUserOpen(true);
  };

  return (
    <div className={"mainPanelDiv"}>
      <div className={"tableMainPanelDiv"}>
        {editGroupOpen ? (
          <EditGroup
            session={session!}
            open={editGroupOpen}
            onClose={closeEditDialog}
            group={openGroup!}
            userList={users!}
          />
        ) : null}

        {deleteUserOpen ? (
          <DeleteGroup
            session={session!}
            open={deleteUserOpen}
            onClose={closeDeleteDialog}
            group={openGroup!}
          />
        ) : null}

        {addUserOpen ? (
          <AddGroup
            session={session!}
            users={users!}
            open={addUserOpen}
            onClose={closeAddUserDialog}
          />
        ) : null}

        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column" alignItems="flex-start">
            <h3>Manage Groups</h3>
            <p>Manage groups in the organization</p>
          </Stack>
          <Button
            style={{ borderRadius: "50px" }}
            appearance="primary"
            size="md"
            onClick={onAddUserClick}
          >
            Add Group
          </Button>
        </Stack>

        {loadingDisplay == LOADING_DISPLAY_NONE &&
        groups &&
        groups.length > 0 ? (
          <div>
            <Table autoHeight data={groups} style={{ marginTop: "20px" }}>
              <Column width={200}>
                <HeaderCell>
                  <h6>Group</h6>
                </HeaderCell>
                <Cell dataKey="displayName" />
              </Column>

              <Column width={200}>
                <HeaderCell>
                  <h6>User Store</h6>
                </HeaderCell>
                <Cell dataKey="userStore" />
              </Column>

              <Column flexGrow={1} fixed="right" align="right">
                <HeaderCell>
                  <h6></h6>
                </HeaderCell>

                <Cell>
                  {(rowData) => (
                    <span>
                      <a
                        onClick={() => onEditClick(rowData as InternalGroup)}
                        style={{ cursor: "pointer", paddingRight: "20px" }}
                      >
                        <EditIcon />
                      </a>
                      <a
                        onClick={() => onDeleteClick(rowData as InternalGroup)}
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
        <div style={loadingDisplay}>
          <Loader size="md" backdrop content="" vertical />
        </div>
      </div>
    </div>
  );
}
