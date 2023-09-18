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

import Image from "next/image";
import { Avatar, Modal } from "rsuite";
import { IdentityProviderTemplate } from "../../../../../models/identityProvider/identityProvider";
import { getImageForTheIdentityProvider } from "../../../../../utils/identity-provider-utils";

interface SelectIdentityProviderProps {
  openModal: boolean;
  onClose: () => void;
  templates: IdentityProviderTemplate[];
  onTemplateSelected: (
    IdentityProviderTemplate: IdentityProviderTemplate
  ) => void;
}

/**
 *
 * @param prop - openModal (function to open the modal), onClose (what will happen when modal closes),
 *               templates (templates list), onTemplateSelected
 *              (what will happen when a particular template is selected)
 *
 * @returns A modal to select idp's
 */
export default function SelectIdentityProvider(
  props: SelectIdentityProviderProps
) {
  const { openModal, onClose, templates, onTemplateSelected } = props;

  return (
    <Modal open={openModal} onClose={onClose} onBackdropClick={onClose}>
      <Modal.Header>
        <>
          <Modal.Title>
            <h4>Select Login Connection</h4>
          </Modal.Title>
          <p>Choose one of the following connections</p>
        </>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className={"idp__template__list"}>
            {templates.map((template) => {
              return (
                <div
                  key={template.id}
                  className={"idp__template__card"}
                  onClick={() => onTemplateSelected(template)}
                >
                  <div>
                    <h5>{template.name}</h5>
                    <small>{template.description}</small>
                  </div>

                  <Avatar style={{ background: "rgba(255,0,0,0)" }}>
                    <Image
                      src={getImageForTheIdentityProvider(template.templateId!)}
                      alt="idp image"
                      width={40}
                    />
                  </Avatar>
                </div>
              );
            })}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
