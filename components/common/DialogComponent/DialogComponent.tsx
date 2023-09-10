import React from "react";
import { Notification, Toaster } from "rsuite";

interface DialogComponentProps {
  type: "error" | "info" | "success" | "warning";
  header: string;
  body?: string;
}

/**
 *
 * @param prop - type (error, info, success ), header - title text, body - body text
 *
 * @returns A side dialog to show notifications
 */
function DialogComponent(prop: DialogComponentProps) {
  const { type, header, body } = prop;

  return (
    <Notification type={type} header={header} closable>
      {body}
    </Notification>
  );
}

/**
 *
 * @param toaster - `useToaster()` get the toaster
 * @param type - `error`, `info`, `success` or `warning`
 * @param header - header text
 * @param body - body text
 *
 * @returns - A notification dialog based on the `type`
 */
async function showDialog(
  toaster: Toaster,
  type: "error" | "info" | "success" | "warning",
  header: string,
  body?: string
) {
  const toasteKey = toaster.push(
    <DialogComponent type={type} header={header} body={body} />,
    {
      placement: "bottomStart",
    }
  );

  if (toasteKey) {
    const key: string = toasteKey.toString();

    setTimeout(() => toaster.remove(key), 2500);
  }
}

/**
 *
 * @param toaster - `useToaster()` get the toaster
 * @param header - header text
 * @param body - body text
 *
 * @returns - A error type notification dialog
 */
export function errorTypeDialog(
  toaster: Toaster,
  header: string,
  body?: string
) {
  showDialog(toaster, "error", header, body);
}

/**
 *
 * @param toaster - `useToaster()` get the toaster
 * @param header - header text
 * @param body - body text
 *
 * @returns - A information type notification dialog
 */
export function infoTypeDialog(
  toaster: Toaster,
  header: string,
  body?: string
) {
  showDialog(toaster, "info", header, body);
}

/**
 *
 * @param toaster - `useToaster()` get the toaster
 * @param header - header text
 * @param body - body text
 *
 * @returns - A success type notification dialog
 */
export function successTypeDialog(
  toaster: Toaster,
  header: string,
  body?: string
) {
  showDialog(toaster, "success", header, body);
}

/**
 *
 * @param toaster - `useToaster()` get the toaster
 * @param header - header text
 * @param body - body text
 *
 * @returns - A warning type notification dialog
 */
export function warningTypeDialog(
  toaster: Toaster,
  header: string,
  body?: string
) {
  showDialog(toaster, "warning", header, body);
}
