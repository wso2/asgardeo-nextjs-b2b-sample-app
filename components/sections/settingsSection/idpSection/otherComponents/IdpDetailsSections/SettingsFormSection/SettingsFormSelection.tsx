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

import InfoOutlineIcon from "@rsuite/icons/InfoOutline";
import { infoTypeDialog } from "../../../../../../common/DialogComponent/DialogComponent";
import { CopyTextToClipboardCallback } from "../../../../../../../utils/util-common/common";
import { copyTheTextToClipboard } from "../../../../../../../utils/util-common/common";
import CopyIcon from "@rsuite/icons/Copy";
import React from "react";
import { Field } from "react-final-form";
import { Form, InputGroup, Stack, Toaster, useToaster } from "rsuite";
import FormSuite from "rsuite/Form";
import {
  IdentityProviderFederatedAuthenticatorProperty,
  IdentityProviderTemplate,
  IdentityProviderTemplateModel,
  IdentityProviderTemplateModelAuthenticatorProperty,
} from "../../../../../../../models/identityProvider/identityProvider";
import { selectedTemplateBaesedonTemplateId } from "../../../../../../../utils/application-utils";

interface SettingsFormSelectionProps {
  templateId: string;
  federatedAuthenticators: IdentityProviderFederatedAuthenticatorProperty[];
}

/**
 *
 * @param prop - templateId, federatedAuthenticators (federatedAuthenticators as a list)
 *
 * @returns Component of the settings section of the idp interface
 */
export default function SettingsFormSelection(
  props: SettingsFormSelectionProps
) {
  const { templateId, federatedAuthenticators } = props;

  const toaster: Toaster = useToaster();

  const propList = ():
    | IdentityProviderTemplateModelAuthenticatorProperty[]
    | null => {
    const selectedTemplate: IdentityProviderTemplate | null =
      selectedTemplateBaesedonTemplateId(templateId);
    if (selectedTemplate) {
      return selectedTemplate.idp!.federatedAuthenticators!.authenticators[0]
        .properties!;
    } else {
      return null;
    }
  };

  const selectedValue = (key: string): string => {
    const keyFederatedAuthenticator = federatedAuthenticators.filter(
      (obj) => obj.key === key
    )[0];

    return keyFederatedAuthenticator ? keyFederatedAuthenticator.value : "";
  };

  const copyValueToClipboard = (text: string): void => {
    const callback: CopyTextToClipboardCallback = () =>
      infoTypeDialog(toaster, "Text copied to clipboard");

    copyTheTextToClipboard(text, callback);
  };

  return (
    <>
      {propList() ? (
        propList()!.map((property) => {
          return (
            <Field
              id={property.key}
              key={property.key}
              name={property.key!}
              initialValue={selectedValue(property.key!)}
              render={({ input, meta }) => (
                <FormSuite.Group controlId={property.key}>
                  <FormSuite.ControlLabel>
                    <b>{property.displayName}</b>
                  </FormSuite.ControlLabel>
                  <InputGroup inside style={{ width: "100%" }}>
                    <FormSuite.Control
                      readOnly={property.readOnly ? property.readOnly : false}
                      {...input}
                    />

                    {property.readOnly ? (
                      <InputGroup.Button
                        onClick={() =>
                          copyValueToClipboard(selectedValue(property.key!))
                        }
                      >
                        <CopyIcon />
                      </InputGroup.Button>
                    ) : null}
                  </InputGroup>
                  <Stack style={{ marginTop: "1px" }}>
                    <InfoOutlineIcon
                      style={{ marginLeft: "1px", marginRight: "5px" }}
                    />
                    <Form.HelpText>{property.description}</Form.HelpText>
                  </Stack>

                  {meta.error && meta.touched && (
                    <FormSuite.ErrorMessage show={true}>
                      {meta.error}
                    </FormSuite.ErrorMessage>
                  )}
                </FormSuite.Group>
              )}
            />
          );
        })
      ) : (
        <p>Access the console to edit this connection</p>
      )}
    </>
  );
}
