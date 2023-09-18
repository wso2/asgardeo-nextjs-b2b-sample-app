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

import {
  errorTypeDialog,
  successTypeDialog,
} from "../../../../common/DialogComponent/DialogComponent";
import {
  BASIC_AUTHENTICATOR_ID,
  BASIC_ID,
  ENTERPRISE_AUTHENTICATOR_ID,
  ENTERPRISE_ID,
  GOOGLE_AUTHENTICATOR_ID,
  GOOGLE_ID,
  checkIfJSONisEmpty,
} from "../../../../../utils/util-common/common";
import {
  LOADING_DISPLAY_BLOCK,
  LOADING_DISPLAY_NONE,
} from "../../../../../utils/front-end-util/frontend-util";
import { Session } from "next-auth";
import React, { useState } from "react";
import {
  Avatar,
  Button,
  Col,
  Grid,
  Loader,
  Modal,
  Row,
  Toaster,
  useToaster,
} from "rsuite";
import { PatchApplicationAuthMethod } from "../../../../../utils/application-utils";
import {
  Application,
  AuthenticationSequence,
  AuthenticationSequenceModel,
  AuthenticationSequenceStepOption,
} from "../../../../../models/application/application";
import { IdentityProvider } from "../../../../../models/identityProvider/identityProvider";
import RequestMethod from "../../../../../models/api/requestMethod";

interface ApplicationListItemProps {
  applicationDetail: Application;
}

interface ApplicationListAvailableProps {
  applicationDetail: Application;
  idpIsinAuthSequence: boolean;
}

interface ConfirmAddRemoveLoginFlowModalProps {
  session: Session;
  applicationDetail: Application;
  idpDetails: IdentityProvider;
  idpIsinAuthSequence: boolean;
  openModal: boolean;
  onModalClose: () => void;
  fetchAllIdPs: () => Promise<void>;
}

/**
 *
 * @param prop - session, applicationDetail, idpDetails, idpIsinAuthSequence, openModal, onModalClose, fetchAllIdPs
 *
 * @returns Add/Remove from login flow button
 */
export default function ConfirmAddRemoveLoginFlowModal(
  props: ConfirmAddRemoveLoginFlowModalProps
) {
  const {
    session,
    applicationDetail,
    idpDetails,
    idpIsinAuthSequence,
    openModal,
    onModalClose,
    fetchAllIdPs,
  } = props;

  const toaster: Toaster = useToaster();
  const [loadingDisplay, setLoadingDisplay] = useState(LOADING_DISPLAY_NONE);

  const onSuccess = (): void => {
    onModalClose();
    fetchAllIdPs().finally();
  };

  const onIdpAddToLoginFlow = (response: boolean | null): void => {
    if (response) {
      onSuccess();
      successTypeDialog(
        toaster,
        "Success",
        "Connection Added to the Login Flow Successfully."
      );
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while adding the the Connection."
      );
    }
  };

  const onIdpRemovefromLoginFlow = (response: boolean | null): void => {
    if (response) {
      onSuccess();
      successTypeDialog(
        toaster,
        "Success",
        "Connection Removed from the Login Flow Successfully."
      );
    } else {
      errorTypeDialog(
        toaster,
        "Error Occured",
        "Error occured while removing the connection. Try again."
      );
    }
  };

  const onSubmit = async (
    patchApplicationAuthMethod: boolean
  ): Promise<void> => {
    setLoadingDisplay(LOADING_DISPLAY_BLOCK);
    patchApplicationAuthSteps(
      session,
      applicationDetail,
      idpDetails,
      patchApplicationAuthMethod
    )
      .then((response) =>
        idpIsinAuthSequence
          ? onIdpRemovefromLoginFlow(response)
          : onIdpAddToLoginFlow(response)
      )
      .finally(() => setLoadingDisplay(LOADING_DISPLAY_NONE));
  };

  const onRemove = async (): Promise<void> => {
    await onSubmit(PatchApplicationAuthMethod.REMOVE);
  };

  const onAdd = async (): Promise<void> => {
    await onSubmit(PatchApplicationAuthMethod.ADD);
  };

  async function patchApplicationAuthSteps(
    session: Session,
    template: Application,
    idpDetails: IdentityProvider,
    method: boolean
  ): Promise<boolean | null> {
    try {
      const applicationId = template.id;
      const idpName = idpDetails.name;
      const idpTempleteId = idpDetails.templateId;

      const authenticationSequenceModel: AuthenticationSequenceModel = {
        authenticationSequence: addRemoveAuthSequence(
          template,
          idpTempleteId,
          idpName,
          method
        ),
      };

      const body = {
        orgId: session ? session.orgId : null,
        param: authenticationSequenceModel,
        session: session,
      };
      const request = {
        body: JSON.stringify(body),
        method: RequestMethod.POST,
      };

      const res = await fetch(
        `/api/settings/application/patchApplicationAuthSteps/${applicationId}`,
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

  /**
   *
   * @param template - identity provider object template
   * @param idpTempleteId - identity provider template id
   * @param idpName - identity provider name
   * @param method - PatchApplicationAuthMethod
   *
   * @returns add or remove idp from the login sequence
   */
  function addRemoveAuthSequence(
    template: Application,
    idpTempleteId: string,
    idpName: string,
    method: boolean
  ): AuthenticationSequence {
    const authenticationSequenceModel =
      getAuthenticationSequenceModel(template);
    if (method) {
      authenticationSequenceModel.steps[0].options.push(
        getAuthenticatorBody(idpTempleteId, idpName)
      );

      return authenticationSequenceModel;
    } else {
      for (let j = authenticationSequenceModel.steps.length - 1; j >= 0; j--) {
        const step = authenticationSequenceModel.steps[j];
        for (let i = 0; i < step.options.length; i++) {
          if (step.options[i].idp === idpName) {
            authenticationSequenceModel.steps[j].options.splice(i, 1);
            if (
              authenticationSequenceModel.steps[j].options.length === 0 &&
              j === 0
            ) {
              authenticationSequenceModel.steps[0].options.push(
                getAuthenticatorBody(BASIC_ID, "LOCAL")
              );
            } else if (
              authenticationSequenceModel.steps[j].options.length === 0
            ) {
              authenticationSequenceModel.steps.splice(j, 1);
            }
            break;
          }
        }
      }
      return authenticationSequenceModel;
    }
  }

  /**
   *
   * @param template - identity provider object template
   *
   * @returns get authentication sequence
   */
  function getAuthenticationSequenceModel(
    template: Application
  ): AuthenticationSequence {
    const authenticationSequenceModel = template.authenticationSequence;

    delete authenticationSequenceModel.requestPathAuthenticators;

    authenticationSequenceModel.type = "USER_DEFINED";

    return authenticationSequenceModel;
  }

  /**
   *
   * @param idpTempleteId - identity provider template id
   * @param idpName - identity provider name
   *
   * @returns get authenticator body
   */
  function getAuthenticatorBody(
    idpTempleteId: string,
    idpName: string
  ): AuthenticationSequenceStepOption {
    return {
      authenticator: getAuthenticatorId(idpTempleteId) as string,
      idp: idpName,
    };
  }

  /**
   *
   * @param templateId - GOOGLE_ID, ENTERPRISE_ID, BASIC_ID
   *
   * @returns get authenticator id for the given template id
   */
  function getAuthenticatorId(templateId: string): string | null {
    switch (templateId) {
      case GOOGLE_ID:
        return GOOGLE_AUTHENTICATOR_ID;
      case ENTERPRISE_ID:
        return ENTERPRISE_AUTHENTICATOR_ID;
      case BASIC_ID:
        return BASIC_AUTHENTICATOR_ID;
      default:
        return null;
    }
  }

  return (
    <Modal open={openModal} onClose={onModalClose}>
      <Modal.Header>
        <Modal.Title>
          <b>
            {idpIsinAuthSequence
              ? "Remove Identity Provider from the Login Flow"
              : "Add Identity Provider to the Login Flow"}
          </b>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {checkIfJSONisEmpty(applicationDetail) ? (
          <EmptySelectApplicationBody />
        ) : (
          <ApplicationListAvailable
            applicationDetail={applicationDetail}
            idpIsinAuthSequence={idpIsinAuthSequence}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={idpIsinAuthSequence ? onRemove : onAdd}
          className={"addLoginFlowBtn"}
          appearance="primary"
        >
          Confirm
        </Button>
        <Button
          onClick={onModalClose}
          className={"addLoginFlowBtn"}
          appearance="ghost"
        >
          Cancel
        </Button>
      </Modal.Footer>

      <div style={loadingDisplay}>
        <Loader
          size="lg"
          backdrop
          content="Idp is adding to the login flow"
          vertical
        />
      </div>
    </Modal>
  );
}

/**
 *
 * @returns When then `config.ManagementAPIConfig.SharedApplicationName` is not the correct applicaiton,
 * it will show this section
 */
function EmptySelectApplicationBody() {
  return (
    <div>
      <p>No Application Available</p>
      <div style={{ marginLeft: "5px" }}>
        <div>
          Create an application from the WSO2 IS or Asgardeo Console app to add
          authentication.
        </div>
        <p>For more details check out the following links</p>
        <ul>
          <li>
            <a
              href="https://wso2.com/asgardeo/docs/guides/applications/"
              target="_blank"
              rel="noreferrer"
            >
              Add application from Asgardeo Console
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

/**
 *
 * @param prop - idpIsinAuthSequence, applicationDetail
 *
 * @returns  When then config.ManagementAPIConfig.SharedApplicationName is the correct applicaiton,
 * it will show this section
 */
function ApplicationListAvailable(props: ApplicationListAvailableProps) {
  const { idpIsinAuthSequence, applicationDetail } = props;
  return (
    <div>
      {idpIsinAuthSequence ? (
        <p>
          This will remove the Idp as an authentication step from all
          applicaitons
        </p>
      ) : (
        <p>
          This will add the Idp as an authentication step to the authentication
          flow of the following applicaiton
        </p>
      )}

      {idpIsinAuthSequence ? null : (
        <ApplicationListItem applicationDetail={applicationDetail} />
      )}

      <p>Please confirm your action to procced</p>
    </div>
  );
}

/**
 *
 * @param prop - applicationDetail
 *
 * @returns The component to show the applicaiton name and the description
 */
function ApplicationListItem(props: ApplicationListItemProps) {
  const { applicationDetail } = props;

  return (
    <div style={{ marginBottom: 15, marginTop: 15 }}>
      <Grid fluid>
        <Row>
          <Col>
            <Avatar>{applicationDetail.name[0]}</Avatar>
          </Col>

          <Col>
            <div>{applicationDetail.name}</div>
            <p>{applicationDetail.description}</p>
          </Col>
        </Row>
      </Grid>
    </div>
  );
}
