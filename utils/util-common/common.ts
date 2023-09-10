/**
 *  @returns true if JSON is empty else false
 */
export function checkIfJSONisEmpty(obj: Record<string, unknown> | undefined): boolean {
    if (!obj) {

        return true;
    }

    return sizeOfJson(obj) === 0;
}

/**
 *  @returns the size of JSON object
 */
export function sizeOfJson(obj: Record<string, unknown>): number {
    return Object.keys(obj).length;
}

export type CopyTextToClipboardCallback = () => void;

/**
 * Copy the pased `text` to the clipboard and shows a notification
 * 
 * @param text - text that need to be copied to the clipboard
 * @param toaster - toaster object
 */
export function copyTheTextToClipboard(text: string, callback: CopyTextToClipboardCallback): void {
    navigator.clipboard.writeText(text);
    callback();
}

/**
 * 
 * @returns random generatored rgb colour
 */
export function random_rgba(): string {
    const o = Math.round, r = Math.random, s = 255;

    return "rgba(" + o(r() * s) + "," + o(r() * s) + "," + o(r() * s) + "," + r().toFixed(1) + ")";
}

/**
 * operations that we can do on PATCH methods
 */
export enum PatchMethod {
    ADD = "ADD",
    REMOVE = "REMOVE",
    REPLACE = "REPLACE"
}

export const GOOGLE_ID = "google-idp";
export const ENTERPRISE_ID = "enterprise-idp";
export const BASIC_ID = "basic-idp";
export const EMPTY_STRING = "";

export const GOOGLE_AUTHENTICATOR_ID = "GoogleOIDCAuthenticator";
export const ENTERPRISE_AUTHENTICATOR_ID = "OpenIDConnectAuthenticator";
export const BASIC_AUTHENTICATOR_ID = "BasicAuthenticator";

