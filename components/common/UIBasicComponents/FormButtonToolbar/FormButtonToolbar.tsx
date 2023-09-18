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

import { Button, ButtonToolbar } from "rsuite";
import FormSuite from "rsuite/Form";

export interface FormButtonToolbarProps {
  submitButtonText?: string;
  cancelButtonText?: string;
  needCancel: boolean;
  onCancel?: () => void;
  submitButtonDisabled: boolean;
}

/**
 *
 * @param props `FormButtonToolbarProps`
 *
 * @returns Button toolbar for the forms
 */
function FormButtonToolbar(props: FormButtonToolbarProps) {
  const {
    submitButtonText,
    cancelButtonText,
    needCancel,
    onCancel,
    submitButtonDisabled,
  } = props;

  return (
    <FormSuite.Group>
      <ButtonToolbar>
        <Button
          className={"formButton"}
          size="md"
          appearance="primary"
          type="submit"
          disabled={submitButtonDisabled}
        >
          {submitButtonText}
        </Button>

        {needCancel ? (
          <Button
            className={"formButton"}
            size="md"
            appearance="ghost"
            type="button"
            onClick={onCancel}
          >
            {cancelButtonText}
          </Button>
        ) : null}
      </ButtonToolbar>
    </FormSuite.Group>
  );
}

FormButtonToolbar.defaultProps = {
  submitButtonText: "Submit",
  cancelButtonText: "Cancel",
  needCancel: true,
};

export default FormButtonToolbar;
