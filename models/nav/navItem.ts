export interface SideNavItem {
    title: string,
    eventKey: string,
    icon?: string,
    type: string,
    hideBasedOnScope?: boolean,
    items?: SideNavItem[],
    scopes? : string[],
    route: string
}

export default SideNavItem;
