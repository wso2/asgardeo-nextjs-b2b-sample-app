import { Button, Stack } from "rsuite";
import React, { useState } from "react";
import RequestMethod from "../../../models/api/requestMethod";
import { useSession } from "next-auth/react";

/**
 * API Call component.
 */
export default function APICall() {
  const [userInfo, setUserInfo] = useState<any>();
  const { data: session, status } = useSession();

  const message =
    "Initiate a request to an external API and retrieve the response. This involves communicating with an external server through a " +
    "designated API, requesting specific data or executing particular actions inherent to the API's functionality.";

  async function handleApiCall() {
    try {
      const body = {
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch(`/api/externalApi/callApi`, request);
      const usersData = await res.json();

      setUserInfo(usersData);
    } catch (err) {
      return null;
    }
  }

  return (
    <div className={"mainPanelDiv"}>
      <div className={"tableMainPanelDiv"}>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column" alignItems="flex-start">
            <h3>External API</h3>
            <p>Invoke an external API by clicking on the button below.</p>
          </Stack>
          <Button
            className={"addBtn"}
            appearance="primary"
            size="md"
            onClick={handleApiCall}
          >
            Invoke API
          </Button>
        </Stack>
        <p>{message}</p>
        <h3>Output</h3>
        <pre className={"contentToCopy"}>
          {JSON.stringify(userInfo, null, 2)}
        </pre>
      </div>
    </div>
  );
}
