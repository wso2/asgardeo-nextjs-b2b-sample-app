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
import React from "react";
import { Field } from "react-final-form";
import { Form, Stack } from "rsuite";
import FormSuite from "rsuite/Form";

export interface FormFieldProps {
  name: string;
  label: string;
  children: JSX.Element;
  helperText?: string;
  needErrorMessage?: boolean;
  type?: string;
}

function FormField(props: FormFieldProps) {
  const { name, label, helperText, needErrorMessage, type, children } = props;

  return (
    <Field
      name={name}
      type={type}
      render={({ input, meta }) => (
        <FormSuite.Group controlId={name}>
          <FormSuite.ControlLabel>
            <b>{label}</b>
          </FormSuite.ControlLabel>

          {React.cloneElement(children, { ...input })}

          {helperText ? (
            <Stack style={{ marginTop: "1px" }}>
              <InfoOutlineIcon
                style={{ marginLeft: "1px", marginRight: "5px" }}
              />
              <Form.HelpText>{helperText}</Form.HelpText>
            </Stack>
          ) : null}

          {needErrorMessage && meta.error && meta.touched && (
            <FormSuite.ErrorMessage show={true}>
              {meta.error}
            </FormSuite.ErrorMessage>
          )}
        </FormSuite.Group>
      )}
    />
  );
}

export default FormField;
