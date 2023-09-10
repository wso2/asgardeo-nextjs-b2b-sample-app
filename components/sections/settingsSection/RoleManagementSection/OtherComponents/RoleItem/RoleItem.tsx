import AccordianItemHeaderComponent from "../../../../../common/AccordianItemHeader/AccordianItemHeader";
import { Session } from "next-auth";
import { useState } from "react";
import { Button, List, Nav, Panel, Popover, Stack, Whisper } from "rsuite";
import Groups from "./RoleItemDetailsSection/Groups";
import { Role } from "../../../../../../models/role/role";
import ExternalGroups from "./RoleItemDetailsSection/ExtenalGroups";

interface RoleItemNavProps {
  activeKeyNav: string;
  activeKeyNavSelect: (eventKey: string) => void;
}

interface RoleItemProps {
  session: Session;
  role: Role;
  appId: string;
}

/**
 *
 * @param prop - session, role(roledetails)
 *
 * @returns role item component.
 */
export default function RoleItem(props: RoleItemProps) {
  const { session, role, appId } = props;

  const [activeKeyNav, setActiveKeyNav] = useState<string>("1");

  const activeKeyNavSelect = (eventKey: string): void => {
    setActiveKeyNav(eventKey);
  };

  const roleItemDetailsComponent = (activeKey: string): JSX.Element | null => {
    switch (activeKey) {
      case "1":
        return <Groups session={session} roleDetails={role} appId={appId} />;
      case "2":
        return (
          <ExternalGroups session={session} roleDetails={role} appId={appId} />
        );
      default:
        return null;
    }
  };

  const speaker = (
    <Popover title="Permissions" style={{ width: 200 }}>
      {role.permissions ? (
        role.permissions.length === 0 ? (
          <p> Permissions are not set at the moment.</p>
        ) : (
          <>
            <List size="sm">
              {role.permissions.map((item, index) => (
                <List.Item key={index} index={index}>
                  {item.name}
                </List.Item>
              ))}
            </List>
          </>
        )
      ) : null}
    </Popover>
  );

  return role ? (
    <Panel
      header={
        <AccordianItemHeaderComponent
          title={role.name}
          description={`Application role ${role.name} details`}
        />
      }
    >
      <div style={{ marginRight: "25px" }}>
        <Stack direction="column" alignItems="stretch">
          <Stack alignItems="stretch">
            <Whisper
              placement="top"
              trigger="hover"
              controlId="control-id-hover"
              speaker={speaker}
            >
              <Button style={{ borderRadius: "50px" }}>View Permission</Button>
            </Whisper>
          </Stack>
          <RoleItemNav
            activeKeyNav={activeKeyNav}
            activeKeyNavSelect={activeKeyNavSelect}
          />
          <div>{roleItemDetailsComponent(activeKeyNav)}</div>
        </Stack>
      </div>
    </Panel>
  ) : null;
}

/**
 *
 * @param prop - `activeKeyNav`, `activeKeyNavSelect`
 *
 * @returns navigation bar of role item section
 */
function RoleItemNav(props: RoleItemNavProps) {
  const { activeKeyNav, activeKeyNavSelect } = props;

  return (
    <Nav
      appearance="subtle"
      activeKey={activeKeyNav}
      style={{ marginBottom: 10, marginTop: 15 }}
    >
      <div
        style={{
          alignItems: "stretch",
          display: "flex",
        }}
      >
        {/* <Nav.Item
          eventKey="1"
          onSelect={(eventKey) => activeKeyNavSelect(eventKey!)}
        >
          Permissions
        </Nav.Item> */}

        <Nav.Item
          eventKey="1"
          onSelect={(eventKey) => activeKeyNavSelect(eventKey!)}
        >
          Groups
        </Nav.Item>
        <Nav.Item
          eventKey="2"
          onSelect={(eventKey) => activeKeyNavSelect(eventKey!)}
        >
          External Groups
        </Nav.Item>
      </div>
    </Nav>
  );
}
