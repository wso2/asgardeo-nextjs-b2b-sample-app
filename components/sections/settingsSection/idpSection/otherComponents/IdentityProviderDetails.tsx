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

import AccordionItemHeaderComponent from "../../../../common/AccordianItemHeader/AccordianItemHeader";
import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import { Nav, Panel, Stack } from "rsuite";
import ButtonGroupIdentityProviderDetails from "./ButtonGroupIdentityProviderDetails";
import General from "./IdpDetailsSections/General";
import Settings from "./IdpDetailsSections/Settings";
import Groups from "./IdpDetailsSections/Groups";
import { getImageForTheIdentityProvider } from "../../../../../utils/identity-provider-utils";
import { selectedTemplateBaesedonTemplateId } from "../../../../../utils/application-utils";
import { IdentityProvider } from "../../../../../models/identityProvider/identityProvider";
import RequestMethod from "../../../../../models/api/requestMethod";

interface IdentityProviderDetailsProps {
  session: Session;
  id: string;
  fetchAllIdPs: () => Promise<void>;
}

/**
 *
 * @param prop - session, id (idp id), fetchAllIdPs (function to fetch all Idps)
 *
 * @returns idp item details component
 */
export default function IdentityProviderDetails(
  props: IdentityProviderDetailsProps
) {
  const { session, id, fetchAllIdPs } = props;

  const [idpDetails, setIdpDetails] = useState<IdentityProvider | null>();
  const [activeKeyNav, setActiveKeyNav] = useState<string>("1");

  const fetchData = useCallback(async () => {
    const res: IdentityProvider | null = await getDetailedIdentityProvider(
      session,
      id
    );

    setIdpDetails(res);
  }, [session, id]);

  async function getDetailedIdentityProvider(
    session: Session,
    id: string
  ): Promise<IdentityProvider | null> {
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
        `/api/settings/identityProvider/getDetailedIdentityProvider/${id}`,
        request
      );
      const data = await res.json();

      return data;
    } catch (err) {
      return null;
    }
  }

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const activeKeyNavSelect = (eventKey: string): void => {
    setActiveKeyNav(eventKey);
  };

  const idpDetailsComponent = (activeKey: string): JSX.Element | undefined => {
    switch (activeKey) {
      case "1":
        return (
          <General
            session={session}
            idpDetails={idpDetails!}
            fetchData={fetchData}
          />
        );
      case "2":
        return <Settings session={session} idpDetails={idpDetails!} />;
      case "3":
        return <Groups session={session} idpDetails={idpDetails!} />;
    }
  };

  return idpDetails ? (
    <Panel
      header={
        <AccordionItemHeaderComponent
          imageSrc={getImageForTheIdentityProvider(idpDetails.templateId)}
          title={idpDetails.name}
          description={idpDetails.description}
        />
      }
      eventKey={id}
      id={id}
    >
      <div style={{ marginLeft: "25px", marginRight: "25px" }}>
        <Stack direction="column" alignItems="stretch">
          <ButtonGroupIdentityProviderDetails
            session={session}
            id={id}
            fetchAllIdPs={fetchAllIdPs}
            idpDetails={idpDetails}
          />
          <IdentityProviderDetailsNav
            activeKeyNav={activeKeyNav}
            idpDetails={idpDetails}
            activeKeyNavSelect={activeKeyNavSelect}
          />
          <div>{idpDetailsComponent(activeKeyNav)}</div>
        </Stack>
      </div>
    </Panel>
  ) : null;
}

interface IdentityProviderDetailsNavProps {
  idpDetails: IdentityProvider;
  activeKeyNav: string;
  activeKeyNavSelect: (eventKey: string) => void;
}

/**
 *
 * @param prop - `idpDetails`, `activeKeyNav`, `activeKeyNavSelect`
 *
 * @returns navigation component of idp details
 */
function IdentityProviderDetailsNav(props: IdentityProviderDetailsNavProps) {
  const { idpDetails, activeKeyNav, activeKeyNavSelect } = props;

  const templateIdCheck = (): boolean => {
    const selectedTemplate = selectedTemplateBaesedonTemplateId(
      idpDetails.templateId
    );

    if (selectedTemplate) {
      return true;
    } else {
      return false;
    }
  };

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
        <Nav.Item
          eventKey="1"
          onSelect={(eventKey) => activeKeyNavSelect(eventKey!)}
        >
          General
        </Nav.Item>

        {templateIdCheck() ? (
          <Nav.Item
            eventKey="2"
            onSelect={(eventKey) => activeKeyNavSelect(eventKey!)}
          >
            Settings
          </Nav.Item>
        ) : null}

        <Nav.Item
          eventKey="3"
          onSelect={(eventKey) => activeKeyNavSelect(eventKey!)}
        >
          Group
        </Nav.Item>

        <div style={{ flexGrow: "1" }}></div>
      </div>
    </Nav>
  );
}
