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

import { Session } from "next-auth";
import { IdentityProviderGroupInterface } from "../../../../../../models/identityProvider/identityProvider";
import RequestMethod from "../../../../../../models/api/requestMethod";
import { useCallback, useEffect, useState } from "react";
import TrashIcon from "@rsuite/icons/Trash";
import { Button, Stack, Table } from "rsuite";
import IdpGroupDelete from "./IdpGroupDelete";
import AddIdpGroupComponent from "./AddIdpgroup";

interface GroupsListProps {
  session: Session;
  idpId: string;
}

export default function GroupsList(props: GroupsListProps) {
  const { session, idpId } = props;
  const [idpGroups, setIdpGroups] = useState<
    IdentityProviderGroupInterface[] | []
  >();
  const [addGroupOpen, setAddGroupOpen] = useState<boolean>(false);
  const [newGroupList, setnewGroupList] = useState<
    IdentityProviderGroupInterface[] | null
  >();
  const [deleteGroupOpen, setDeleteGroupOpen] = useState<boolean>(false);
  const { Column, HeaderCell, Cell } = Table;

  const fetchData = useCallback(async () => {
    const res: IdentityProviderGroupInterface[] =
      (await getIdentityProviderGroups(
        session,
        idpId
      )) as IdentityProviderGroupInterface[];

    await setIdpGroups(res);
  }, [session, idpId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onDeleteClick = (deleteGroup: IdentityProviderGroupInterface): void => {
    const newIdpGroupList: IdentityProviderGroupInterface[] = [
      ...idpGroups!.filter(
        (group: IdentityProviderGroupInterface) => group.id !== deleteGroup.id
      ),
    ];
    setnewGroupList(newIdpGroupList);
    setDeleteGroupOpen(true);
  };

  const closeDeleteDialog = (): void => {
    setDeleteGroupOpen(false);
  };

  const onAddGroupClick = (): void => {
    setAddGroupOpen(true);
  };
  const closeAddUserDialog = (): void => {
    setAddGroupOpen(false);
    fetchData();
  };

  async function getIdentityProviderGroups(
    session: Session,
    id: string
  ): Promise<IdentityProviderGroupInterface[] | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch(
        `/api/settings/identityProvider/getIdentityProviderGroups/${id}`,
        request
      );

      const data = await res.json();
      return data;
    } catch (err) {
      return null;
    }
  }

  return (
    <div style={{ marginTop: "30px" }}>
      {deleteGroupOpen ? (
        <IdpGroupDelete
          session={session}
          id={idpId}
          open={deleteGroupOpen}
          onClose={closeDeleteDialog}
          groups={newGroupList!}
          getGroups={fetchData}
        />
      ) : null}

      <AddIdpGroupComponent
        session={session}
        id={idpId}
        groups={idpGroups!}
        open={addGroupOpen}
        onClose={closeAddUserDialog}
      />
      <Stack direction="row" justifyContent="space-between">
        <Stack direction="column" alignItems="flex-start">
          <h6>Manage groups from your connections</h6>
        </Stack>
        <Button
          style={{ borderRadius: "50px" }}
          appearance="primary"
          size="md"
          onClick={onAddGroupClick}
        >
          Add Group
        </Button>
      </Stack>

      {idpGroups ? (
        <div style={{ height: "900", overflow: "auto" }}>
          <Table autoHeight data={idpGroups}>
            <Column width={200} align="center">
              <HeaderCell>
                <h6>Group</h6>
              </HeaderCell>
              <Cell dataKey="name" />
            </Column>

            <Column flexGrow={1} fixed="right" align="right">
              <HeaderCell>
                <h6></h6>
              </HeaderCell>

              <Cell>
                {(rowData) => (
                  <span>
                    <a
                      onClick={() =>
                        onDeleteClick(rowData as IdentityProviderGroupInterface)
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
  );
}
