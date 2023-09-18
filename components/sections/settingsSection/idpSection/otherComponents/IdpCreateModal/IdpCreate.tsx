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

import { CopyTextToClipboardCallback } from "../../../../../../utils/util-common/common";
import {
  ENTERPRISE_ID,
  GOOGLE_ID,
} from "../../../../../../utils/util-common/common";
import { copyTheTextToClipboard } from "../../../../../../utils/util-common/common";
import CopyIcon from "@rsuite/icons/Copy";
import InfoRoundIcon from "@rsuite/icons/InfoRound";
import { Session } from "next-auth";
import {
  FlexboxGrid,
  Input,
  InputGroup,
  Modal,
  Panel,
  Stack,
  useToaster,
} from "rsuite";
import ExternalIdentityProvider from "./ExternalIdentityProvider";
import GoogleIdentityProvider from "./GoogleIdentityProvider";
import {
  IdentityProvider,
  IdentityProviderTemplate,
} from "../../../../../../models/identityProvider/identityProvider";
import { infoTypeDialog } from "../../../../../common/DialogComponent/DialogComponent";
import { getCallbackUrl } from "../../../../../../utils/identity-provider-utils";

interface PrerequisiteProps {
  orgId: string;
}

interface IdpCreateProps {
  session: Session;
  onIdpCreate: (response: IdentityProvider | null) => void;
  onCancel: () => void;
  template: IdentityProviderTemplate;
  orgId: string;
  openModal: boolean;
}

/**
 *
 * @param prop - `IdpCreateProps`
 * @returns Idp creation modal
 */
export default function IdpCreate(props: IdpCreateProps) {
  const { session, openModal, onIdpCreate, onCancel, template, orgId } = props;

  const handleModalClose = (): void => {
    onCancel();
  };

  const resolveTemplateForm = (): JSX.Element | undefined => {
    switch (template.templateId) {
      case GOOGLE_ID:
        return (
          <GoogleIdentityProvider
            session={session}
            template={template}
            onIdpCreate={onIdpCreate}
            onCancel={onCancel}
          />
        );

      case ENTERPRISE_ID:
        return (
          <ExternalIdentityProvider
            session={session}
            template={template}
            onIdpCreate={onIdpCreate}
            onCancel={onCancel}
          />
        );
    }
  };

  return (
    <Modal
      open={openModal}
      onClose={handleModalClose}
      onBackdropClick={handleModalClose}
      size="lg"
    >
      <Modal.Header>
        <>
          <Modal.Title>
            <h4>{template.name}</h4>
          </Modal.Title>
          <p>{template.description}</p>
        </>
      </Modal.Header>
      <Modal.Body>
        <FlexboxGrid justify="space-between">
          <FlexboxGrid.Item colspan={14}>
            {resolveTemplateForm()}
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={9}>
            <Prerequisite orgId={orgId} />
          </FlexboxGrid.Item>
        </FlexboxGrid>
      </Modal.Body>
    </Modal>
  );
}

function Prerequisite(props: PrerequisiteProps) {
  const { orgId } = props;

  const toaster = useToaster();

  const copyValueToClipboard = (text: string) => {
    const callback: CopyTextToClipboardCallback = () =>
      infoTypeDialog(toaster, "Text copied to clipboard");

    copyTheTextToClipboard(text, callback);
  };

  return (
    <Panel
      header={
        <Stack alignItems="center" spacing={10}>
          <InfoRoundIcon />
          <b>Prerequisite</b>
        </Stack>
      }
      bordered
    >
      <p>
        Before you begin, create an OAuth application, and obtain a client ID &
        secret. Add the following URL as the Authorized Redirect URI.
      </p>
      <br />
      <InputGroup>
        <Input readOnly value={getCallbackUrl(orgId)} size="lg" />
        <InputGroup.Button
          onClick={() => copyValueToClipboard(getCallbackUrl(orgId))}
        >
          <CopyIcon />
        </InputGroup.Button>
      </InputGroup>
    </Panel>
  );
}
