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

import Image from "next/image";
import navItem from "../../../models/nav/navItem";
import navList from "../../../models/nav/navList";
import { hideBasedOnScopes } from "../../../utils/front-end-util/frontend-util";
import { Navbar, Nav, Avatar, Stack } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import logo from "../../../images/asgardeo-logo-transparent.png";
import NavData from "../../../components/common/NavBar/Data/Nav.json";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { signout } from "../../../utils/authorization-config-util/authorization-config-util";

export interface NavBarProps {
  activeKeyNav: string | undefined;
  activeKeyNavSelect: (event: string | undefined) => void;
}

function NavBar(props: NavBarProps) {
  const { activeKeyNav, activeKeyNavSelect } = props;
  const { data: session, status } = useSession();
  const NavConfigList: navList = NavData;
  const router = useRouter();

  const signOutOnClick = (
    eventKey: string,
    event: React.SyntheticEvent
  ): void => {
    signout(session!);
  };

  const handleNavItemSelect = (
    eventKey: string,
    event: React.SyntheticEvent
  ) => {
    // Find the selected item based on the eventKey
    const selectedItem = findItemByEventKey(NavConfigList.items, eventKey);
    if (selectedItem) {
      // Construct the full route and navigate
      const fullRoute = getFullRoute(selectedItem, session);
      router.push(fullRoute);
    }
  };

  /**
   *
   * @param prop - items (items array), eventkey
   *
   * @returns An item corresponding to given eventKey in the items array.
   */
  const findItemByEventKey = (items: any[], eventKey: string): any => {
    for (const item of items) {
      if (item.eventKey === eventKey) {
        return item;
      }

      if (item.items) {
        const nestedItem = findItemByEventKey(item.items, eventKey);
        if (nestedItem) {
          return nestedItem;
        }
      }
    }
    return null;
  };

  /**
   *
   * @param prop - selectedItem, session
   *
   * @returns The full route based on the selectedItem and session data.
   */
  const getFullRoute = (selectedItem: any, session: any) => {
    return `/o/${session.orgId}/${selectedItem.route}`;
  };

  const routeToProfile = (
    eventKey: string,
    event: React.SyntheticEvent
  ): void => {
    router.push(`/o/${session!.orgId}/profile`);
  };

  return (
    <div className={"navDiv"}>
      <Navbar appearance="default" className={"navBar"}>
        <Navbar.Brand href="https://wso2.com/asgardeo/">
          <Image src={logo} width={100} alt="logo" />
        </Navbar.Brand>
        <Nav activeKey={activeKeyNav}>
          {NavConfigList.items.map((item: navItem) => {
            if (item.items) {
              return (
                <Nav.Menu
                  className={"navItem"}
                  eventKey={item.eventKey}
                  title={item.title}
                  style={
                    item.hideBasedOnScope
                      ? hideBasedOnScopes(
                          session?.scope!,
                          item.type,
                          item.items
                        )
                      : {}
                  }
                  key={item.eventKey}
                >
                  {item.items.map((item) => (
                    <Nav.Item
                      key={item.eventKey}
                      eventKey={item.eventKey}
                      onSelect={(eventKey, event) => {
                        handleNavItemSelect(eventKey!, event);
                        activeKeyNavSelect(eventKey!);
                      }}
                      style={
                        item.hideBasedOnScope
                          ? hideBasedOnScopes(
                              session?.scope!,
                              item.type,
                              item.items,
                              item.scopes
                            )
                          : {}
                      }
                    >
                      <Stack spacing={10}>{item.title}</Stack>
                    </Nav.Item>
                  ))}
                </Nav.Menu>
              );
            } else {
              return (
                <Nav.Item
                  key={item.eventKey}
                  eventKey={item.eventKey}
                  onSelect={(eventKey, event) => {
                    handleNavItemSelect(eventKey!, event);
                    activeKeyNavSelect(eventKey!);
                  }}
                  style={
                    item.hideBasedOnScope
                      ? hideBasedOnScopes(
                          session!.scope!,
                          item.type,
                          item.items,
                          item.scopes
                        )
                      : {}
                  }
                >
                  <Stack spacing={10}>{item.title}</Stack>
                </Nav.Item>
              );
            }
          })}
        </Nav>
        <Nav pullRight>
          <Nav.Menu
            style={{ paddingRight: "15px" }}
            title={
              <p style={{ color: "black" }}>{session?.user?.name.givenName!}</p>
            }
            icon={
              <Avatar
                circle
                src="https://avatars.githubusercontent.com/u/15609339"
                alt="@hiyangguo"
                style={{ marginRight: "20px" }}
              />
            }
          >
            <Nav.Item
              style={{ paddingRight: "85px" }}
              eventKey={"profile"}
              onSelect={(eventKey, event) => {
                routeToProfile(eventKey!, event);
                activeKeyNavSelect(eventKey!);
              }}
            >
              <Stack spacing={10}>{"Profile"}</Stack>
            </Nav.Item>
            <Nav.Item
              eventKey={"signOut"}
              onSelect={(eventKey, event) => signOutOnClick(eventKey!, event)}
            >
              <Stack spacing={10} className={"signout"}>
                {"Sign out"}
              </Stack>
            </Nav.Item>
          </Nav.Menu>
        </Nav>
      </Navbar>
    </div>
  );
}

export default NavBar;
