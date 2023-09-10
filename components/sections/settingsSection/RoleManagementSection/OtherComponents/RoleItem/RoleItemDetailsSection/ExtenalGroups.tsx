import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Container, FlexboxGrid, PanelGroup, Stack } from "rsuite";
import RequestMethod from "../../../../../../../models/api/requestMethod";
import { Role } from "../../../../../../../models/role/role";
import {
  Application,
  ApplicationAuthenticatorInterface,
  AuthenticationSequenceStep,
  AuthenticationSequenceStepOption,
} from "../../../../../../../models/application/application";
import { AuthenticatorInterface } from "../../../../../../../models/identityProvider/identityProvider";
import AuthenticatorGroup from "./AuthenticatorGroup";

interface ExternalGroupProps {
  session: Session;
  roleDetails: Role;
  appId: string;
}

/**
 *
 * @param prop - session, roleDetails
 *
 * @returns The external groups section of role details
 */
export default function ExternalGroups(props: ExternalGroupProps) {
  const { session, roleDetails, appId } = props;

  const [attributeStepAuthenticators, setAttributeStepAuthenticators] =
    useState<AuthenticationSequenceStepOption[]>([]);
  const [authenticatorGroups, setAuthenticatorGroups] = useState<
    AuthenticatorInterface[]
  >([]);

  const [federatedAuthenticators, setFederatedAuthenticators] = useState<
    AuthenticatorInterface[]
  >([]);

  const fetchData = useCallback(async () => {
    await getApplication(session, appId).then(
      (response: Application | null) => {
        const attributeStepId: number =
          response?.authenticationSequence?.attributeStepId!;
        const attributeStep: AuthenticationSequenceStep =
          response?.authenticationSequence?.steps?.find((step: any) => {
            return step.id === attributeStepId;
          })!;
        setAttributeStepAuthenticators(attributeStep?.options);
      }
    );
  }, [session]);

  async function getApplication(
    session: Session,
    id: string
  ): Promise<Application | null> {
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
        `/api/settings/application/getApplication/${id}`,
        request
      );
      const data = await res.json();

      return data;
    } catch (err) {
      return null;
    }
  }

  const fetchFederatedAuthenticators = useCallback(async () => {
    const res = await getFederatedAuthenticators(session).then(
      (response: AuthenticatorInterface[] | null) => {
        return Promise.resolve(
          response!.filter((authenticator: AuthenticatorInterface) => {
            return (
              authenticator.type === "FEDERATED" &&
              authenticator.name !== "Organization Login"
            );
          })
        );
      }
    );

    setFederatedAuthenticators(res!);
  }, [session, attributeStepAuthenticators]);

  const fetchAutheticatorGroups = () => {
    // Filter the federated autheticators that are in the attribute step
    const filteredFederatedAuthenticators: AuthenticatorInterface[] =
      federatedAuthenticators.filter(
        (federatedAuthenticator: AuthenticatorInterface) => {
          return attributeStepAuthenticators!.find(
            (attributeStepAuthenticator: ApplicationAuthenticatorInterface) => {
              return (
                federatedAuthenticator.name === attributeStepAuthenticator.idp
              );
            }
          );
        }
      );
    setAuthenticatorGroups(filteredFederatedAuthenticators);
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchFederatedAuthenticators();
  }, [fetchFederatedAuthenticators]);

  useEffect(() => {
    if (
      federatedAuthenticators.length <= 0 ||
      attributeStepAuthenticators!.length <= 0
    ) {
      return;
    }

    fetchAutheticatorGroups();
  }, [federatedAuthenticators, attributeStepAuthenticators]);

  async function getFederatedAuthenticators(
    session: Session
  ): Promise<AuthenticatorInterface[] | null> {
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
        `/api/settings/identityProvider/getAuthenticators`,
        request
      );
      const data = await res.json();

      return data;
    } catch (err) {
      return null;
    }
  }

  return (
    <Container>
      {authenticatorGroups && authenticatorGroups.length > 0 ? (
        <FlexboxGrid
          style={{ height: "60vh", marginTop: "24px", width: "100%" }}
          justify="start"
          align="top"
        >
          <div className={"list"}>
            <PanelGroup accordion bordered>
              {authenticatorGroups.map((authenticator, index) => (
                <AuthenticatorGroup
                  session={session}
                  authenticator={authenticator}
                  roleName={roleDetails.name}
                  appId={appId}
                  key={index}
                />
              ))}
            </PanelGroup>
          </div>
        </FlexboxGrid>
      ) : (
        <Stack alignItems="center" direction="column">
          <p style={{ fontSize: 14, marginTop: "50px" }}>
            {"There are no roles created for the organization."}
          </p>
        </Stack>
      )}
    </Container>
  );
}
