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

import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../../common/DialogComponent/DialogComponent";
import { checkIfJSONisEmpty } from "../../../../../utils/util-common/common";
import Trash from "@rsuite/icons/Trash";
import { Session } from "next-auth";
import React, { useCallback, useEffect, useState } from "react";
import { Button, IconButton, Stack, useToaster } from "rsuite";
import ConfirmAddRemoveLoginFlowModal from "./ConfirmAddRemoveLoginFlowModal";
import { checkIfIdpIsinAuthSequence } from "../../../../../utils/application-utils";
import {
  Application,
  ApplicationList,
} from "../../../../../models/application/application";
import RequestMethod from "../../../../../models/api/requestMethod";
import { IdentityProvider } from "../../../../../models/identityProvider/identityProvider";

interface ButtonGroupIdentityProviderDetailsProps {
  session: Session;
  idpDetails: IdentityProvider;
  fetchAllIdPs: () => Promise<void>;
  id: string;
}

/**
 *
 * @param prop - session, idpDetails, fetchAllIdPs, id (idp id)
 *
 * @returns Add/Remove button and delete button group in an Idp
 */
export default function ButtonGroupIdentityProviderDetails(
  props: ButtonGroupIdentityProviderDetailsProps
) {
  const { session, idpDetails, fetchAllIdPs, id } = props;

  const toaster = useToaster();

  const [allApplications, setAllApplications] = useState<ApplicationList>();
  const [applicationDetail, setApplicationDetail] = useState<Application>();
  const [idpIsinAuthSequence, setIdpIsinAuthSequence] = useState<boolean>();
  const [openListAppicationModal, setOpenListAppicationModal] =
    useState<boolean>(false);

  const fetchData = useCallback(async () => {
    const res: ApplicationList = (await listCurrentApplication(
      session
    )) as ApplicationList;

    await setAllApplications(res);
  }, [session, openListAppicationModal]);

  const fetchApplicatioDetails = useCallback(async () => {
    if (
      !checkIfJSONisEmpty(allApplications) &&
      allApplications!.totalResults !== 0
    ) {
      const res: Application = (await getApplication(
        session,
        allApplications!.applications[0].id
      )) as Application;

      await setApplicationDetail(res);
    }
  }, [session, allApplications]);

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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchApplicatioDetails();
  }, [fetchApplicatioDetails]);

  useEffect(() => {
    if (!checkIfJSONisEmpty(applicationDetail)) {
      const check = checkIfIdpIsinAuthSequence(applicationDetail!, idpDetails);

      setIdpIsinAuthSequence(check[0]);
    }
  }, [idpDetails, applicationDetail]);

  const onIdpDelete = (response: boolean | null): void => {
    if (response) {
      successTypeDialog(toaster, "Success", "Connection Deleted Successfully");
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while deleting the Connection. Try again."
      );
    }
  };

  const onIdPDeleteClick = (id: string): void => {
    deleteIdentityProvider(session, id)
      .then((response) => onIdpDelete(response))
      .finally(() => {
        fetchAllIdPs().finally();
      });
  };

  async function deleteIdentityProvider(
    session: Session,
    id: string
  ): Promise<boolean | null> {
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
        `/api/settings/identityProvider/deleteIdentityProvider/${id}`,
        request
      );
      const data = await res.json();
      if (data) {
        return true;
      }
      return data;
    } catch (err) {
      return null;
    }
  }

  const onAddToLoginFlowClick = (): void => {
    setOpenListAppicationModal(true);
  };

  const onCloseListAllApplicaitonModal = (): void => {
    setOpenListAppicationModal(false);
  };

  return (
    <Stack justifyContent="flex-end" alignItems="stretch">
      {idpIsinAuthSequence === null ? null : idpIsinAuthSequence ? (
        <Button
          style={{ borderRadius: "50px" }}
          onClick={onAddToLoginFlowClick}
        >
          Remove from Login Flow
        </Button>
      ) : (
        <Button
          style={{ borderRadius: "50px" }}
          onClick={onAddToLoginFlowClick}
        >
          Add to the Login Flow
        </Button>
      )}

      <ConfirmAddRemoveLoginFlowModal
        session={session}
        openModal={openListAppicationModal}
        onModalClose={onCloseListAllApplicaitonModal}
        fetchAllIdPs={fetchAllIdPs}
        idpDetails={idpDetails}
        applicationDetail={applicationDetail!}
        idpIsinAuthSequence={idpIsinAuthSequence!}
      />

      {idpIsinAuthSequence ? null : (
        <IconButton
          icon={<Trash />}
          style={{ marginLeft: "10px" }}
          onClick={() => onIdPDeleteClick(id)}
          appearance="subtle"
        />
      )}
    </Stack>
  );
}
