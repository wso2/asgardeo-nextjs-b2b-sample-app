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

import EnterpriseIdentityProvider from "../../../../models/identityProvider/data/templates/enterprise-identity-provider.json";
import GoogleIdentityProvider from "../../../../models/identityProvider/data/templates/google.json";
import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../common/DialogComponent/DialogComponent";
import AppSelectIcon from "@rsuite/icons/AppSelect";
import { Session } from "next-auth";
import { useCallback, useEffect, useState } from "react";
import { Button, Container, Loader, Stack, useToaster } from "rsuite";
import IdentityProviderList from "./otherComponents/IdentityProviderList";
import IdpCreate from "./otherComponents/IdpCreateModal/IdpCreate";
import SelectIdentityProvider from "./otherComponents/SelectIdentityProvider";
import {
  IdentityProvider,
  IdentityProviderTemplate,
} from "../../../../models/identityProvider/identityProvider";
import RequestMethod from "../../../../models/api/requestMethod";
import { useSession } from "next-auth/react";
import {
  LOADING_DISPLAY_BLOCK,
  LOADING_DISPLAY_NONE,
} from "../../../../utils/front-end-util/frontend-util";

/**
 * @returns The idp interface section.
 */
export default function IdpSection() {
  const toaster = useToaster();
  const { data: session, status } = useSession();
  const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);

  const [idpList, setIdpList] = useState<IdentityProvider[]>([]);
  const [openSelectModal, setOpenSelectModal] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<IdentityProviderTemplate>();

  const templates: IdentityProviderTemplate[] = [
    EnterpriseIdentityProvider,
    GoogleIdentityProvider,
  ];

  const fetchAllIdPs = useCallback(async () => {
    setLoadingDisplay(LOADING_DISPLAY_BLOCK);
    const res = await listAllIdentityProviders(session!);

    if (res) {
      setIdpList(res);
    } else {
      setIdpList([]);
    }
    setLoadingDisplay(LOADING_DISPLAY_NONE);
  }, [session]);

  async function listAllIdentityProviders(
    session: Session
  ): Promise<IdentityProvider[] | null> {
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
        "/api/settings/identityProvider/listAllIdentityProviders",
        request
      );
      const data = await res.json();

      if (data) {
        if (data.identityProviders) {
          return data.identityProviders;
        } else {
          return [];
        }
      }
      return data;
    } catch (err) {
      return null;
    }
  }

  useEffect(() => {
    fetchAllIdPs();
  }, [fetchAllIdPs]);

  const onAddIdentityProviderClick = (): void => {
    setOpenSelectModal(true);
  };

  const onTemplateSelect = (template: IdentityProviderTemplate): void => {
    setOpenSelectModal(false);
    setSelectedTemplate(template);
  };

  const onSelectIdpModalClose = (): void => {
    setOpenSelectModal(false);
  };

  const onCreationDismiss = (): void => {
    setSelectedTemplate(undefined);
  };

  const onIdpCreated = (response: IdentityProvider | null): void => {
    if (response) {
      successTypeDialog(toaster, "Success", "Connection Created Successfully");

      setIdpList([...idpList, response]);

      setOpenSelectModal(false);
      setSelectedTemplate(undefined);
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while creating the connection. Try again."
      );
    }
  };

  return (
    <div className={"mainPanelDiv"}>
      <Container>
        <Stack direction="row" justifyContent="space-between">
          <Stack direction="column" alignItems="flex-start">
            <h3>Login Connections</h3>
            <p>
              Manage Login Connections to allow users to log in to your
              application through them.
            </p>
          </Stack>

          {idpList && idpList.length !== 0 ? (
            <Button
              style={{ borderRadius: "50px" }}
              appearance="primary"
              size="md"
              onClick={onAddIdentityProviderClick}
            >
              Add Connection
            </Button>
          ) : null}
        </Stack>

        {idpList?.length === 0 ? (
          <Stack
            alignItems="center"
            direction="column"
            style={{ marginTop: "30px" }}
          >
            <AppSelectIcon
              style={{ opacity: 0.2 }}
              width="150px"
              height="150px"
            />
            <p style={{ fontSize: 14, marginTop: "20px" }}>
              There are no connections available at the moment.
            </p>
            <Button
              appearance="primary"
              onClick={onAddIdentityProviderClick}
              size="md"
              style={{ marginTop: "12px", borderRadius: "50px" }}
            >
              Create Connection
            </Button>
          </Stack>
        ) : (
          <IdentityProviderList
            fetchAllIdPs={fetchAllIdPs}
            idpList={idpList}
            session={session!}
          />
        )}

        {openSelectModal && (
          <SelectIdentityProvider
            templates={templates}
            onClose={onSelectIdpModalClose}
            openModal={openSelectModal}
            onTemplateSelected={onTemplateSelect}
          />
        )}
        {selectedTemplate && (
          <IdpCreate
            session={session!}
            onIdpCreate={onIdpCreated}
            onCancel={onCreationDismiss}
            openModal={!!selectedTemplate}
            template={selectedTemplate}
            orgId={session!.orgId!}
          />
        )}
      </Container>
      <div style={loadingDisplay}>
        <Loader size="md" backdrop content="" vertical />
      </div>
    </div>
  );
}
