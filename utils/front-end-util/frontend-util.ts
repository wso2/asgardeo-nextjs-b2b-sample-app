import SideNavItem from "../../models/nav/navItem";

export const LOADING_DISPLAY_NONE = {
  display: "none",
};
export const LOADING_DISPLAY_BLOCK = {
  display: "block",
};

/**
 *
 * @param scopes - scopes of the user
 * @param itemScopes - scopes that required for this section
 *
 * @returns `true` if user has the necessary scopes, else `false`
 */
function hideBasesdOnScopesSideNavItems(
  scopes: string[],
  itemScopes: string[]
): boolean {
  return itemScopes.every((scope) => scopes?.includes(scope));
}

/**
 * hide content based on the user's realated privilages
 *
 * @param scopes - scopes related for the user
 *
 * @returns `LOADING_DISPLAY_BLOCK` if admin, else `LOADING_DISPLAY_NONE`
 */
export function hideBasedOnScopes(
  scopes: string,
  sideNavType: string,
  sideNavItems?: SideNavItem[],
  itemScopes?: string[]
): Record<string, string> {
  const scopesList: string[] = scopes?.split(/\s+/);

  switch (sideNavType) {
    case "item":
      if (hideBasesdOnScopesSideNavItems(scopesList, itemScopes as string[])) {
        return LOADING_DISPLAY_BLOCK;
      } else {
        return LOADING_DISPLAY_NONE;
      }

    case "menu": {
      let check: Record<string, string> = LOADING_DISPLAY_NONE;
      if (sideNavItems) {
        for (let i = 0; i < sideNavItems.length; i++) {
          if (
            hideBasesdOnScopesSideNavItems(
              scopesList,
              sideNavItems[i].scopes as string[]
            )
          ) {
            check = LOADING_DISPLAY_BLOCK;
            break;
          }
        }
      }

      return check;
    }

    default:
      return LOADING_DISPLAY_NONE;
  }
}

/**
 *
 * @param templateId - application details template id
 *
 * @returns template related to the template id.
 */
export function fieldValidate(
  key: string,
  field: unknown,
  errors: Record<string, string>
): Record<string, string> {
  if (!field) {
    errors[key] = "This field cannot be empty";
  }

  return errors;
}
