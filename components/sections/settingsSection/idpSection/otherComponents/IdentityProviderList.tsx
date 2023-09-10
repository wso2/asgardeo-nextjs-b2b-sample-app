import { Session } from "next-auth";
import React from "react";
import { PanelGroup } from "rsuite";
import IdentityProviderDetails from "./IdentityProviderDetails";
import { IdentityProvider } from "../../../../../models/identityProvider/identityProvider";

interface IdentityProviderListProps {
  idpList: IdentityProvider[];
  fetchAllIdPs: () => Promise<void>;
  session: Session;
}

/**
 *
 * @param prop - idpDetails (List of idp's), fetchAllIdPs (function to fetch all idp's), session
 *
 * @returns List of idp's created in the organization
 */
export default function IdentityProviderList(props: IdentityProviderListProps) {
  const { idpList, fetchAllIdPs, session } = props;

  return (
    <div className={"list"}>
      <PanelGroup accordion defaultActiveKey={idpList[0].id} bordered>
        {idpList.map(({ id }) => (
          <IdentityProviderDetails
            key={id}
            session={session}
            id={id}
            fetchAllIdPs={fetchAllIdPs}
          />
        ))}
      </PanelGroup>
    </div>
  );
}
