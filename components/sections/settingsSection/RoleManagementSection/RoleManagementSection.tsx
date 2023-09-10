import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Container, FlexboxGrid, Loader, PanelGroup, Stack } from "rsuite";
import RoleItem from "./OtherComponents/RoleItem/RoleItem";
import RequestMethod from "../../../../models/api/requestMethod";
import { Role } from "../../../../models/role/role";
import { ApplicationList } from "../../../../models/application/application";
import { useSession } from "next-auth/react";
import {
  LOADING_DISPLAY_BLOCK,
  LOADING_DISPLAY_NONE,
} from "../../../../utils/front-end-util/frontend-util";

/**
 *
 *
 * @returns The role management interface section.
 */
export default function RoleManagementSection() {
  const { data: session, status } = useSession();

  const [rolesList, setRolesList] = useState<Role[]>([]);
  const [applicationId, setApplicationId] = useState<ApplicationList>();
  const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);

  const fetchAllRoles = useCallback(async () => {
    setLoadingDisplay(LOADING_DISPLAY_BLOCK);
    const res = await listAllRoles(session!);
    if (res) {
      setRolesList(res);
    } else {
      setRolesList([]);
    }
    setLoadingDisplay(LOADING_DISPLAY_NONE);
  }, [session, applicationId]);

  async function listAllRoles(session: Session): Promise<Role[] | null> {
    try {
      const body = {
        orgId: session ? session.orgId : null,
        session: session,
        appId: applicationId?.applications[0].id,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch("/api/settings/role/listAllRoles", request);
      const data = await res.json();

      if (data) {
        return data.roles;
      }

      return null;
    } catch (err) {
      return null;
    }
  }

  useEffect(() => {
    fetchAllRoles();
  }, [fetchAllRoles]);

  const fetchData = useCallback(async () => {
    const res: ApplicationList = (await listCurrentApplication(
      session!
    )) as ApplicationList;
    await setApplicationId(res);
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function listCurrentApplication(
    session: Session
  ): Promise<ApplicationList | null> {
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
        "/api/settings/application/listCurrentApplication",
        request
      );
      const data = await res.json();

      return data;
    } catch (err) {
      return null;
    }
  }

  return (
    <div className={"mainPanelDiv"}>
      <Container>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column" alignItems="flex-start">
            <h3>Role Management</h3>
            <p>Manage Application roles here.</p>
          </Stack>
        </Stack>

        {loadingDisplay == LOADING_DISPLAY_NONE &&
        rolesList &&
        rolesList.length > 0 ? (
          <FlexboxGrid
            style={{ marginTop: "10px" }}
            justify="start"
            align="top"
          >
            <div className={"list"}>
              <PanelGroup accordion bordered>
                {rolesList.map((role, index) => (
                  <RoleItem
                    session={session!}
                    role={role}
                    appId={applicationId?.applications[0].id!}
                    key={index}
                  />
                ))}
              </PanelGroup>
            </div>
          </FlexboxGrid>
        ) : (
          <FlexboxGrid
            style={{ height: "60vh", marginTop: "24px", width: "100%" }}
            justify="center"
            align="middle"
          >
            <Stack alignItems="center" direction="column">
              <p style={{ fontSize: 14, marginTop: "20px" }}>
                {"There are no roles created for the organization."}
              </p>
            </Stack>
          </FlexboxGrid>
        )}
        <div style={loadingDisplay}>
          <Loader size="md" backdrop content="" vertical />
        </div>
      </Container>
    </div>
  );
}
