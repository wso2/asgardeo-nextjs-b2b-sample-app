import { InternalUser, User } from "../models/user/user";

/**
 * 
 * @param user - (user object return from the IS)
 * 
 * @returns user object that can be view in front end side
 */
export function decodeUser(user: User): InternalUser {

    return {
        "email": user.emails ? user.emails[0] : "-",
        "familyName": user.name ? (user.name.familyName ? user.name.familyName : "-") : "-",
        "firstName": user.name ? (user.name.givenName ? user.name.givenName : "-") : "-",
        "id": user.id ? user.id : "-",
        "username": user.userName ? getUsername(user.userName) : "-"
    };
}

/**
 * 
 * @param email - email
 * 
 * @returns set email.
 */
export function setEmail(email: string) {
    const regex = /^DEFAULT\//g;

    email = email.replace(regex, "");

    return email;
}

/**
 * 
 * @param userName - user name
 * 
 * @returns get username. If the IS is Asgardeo DEFAULT/ is removed from the username else returns the original username
 */
export function getUsername(userName: string) {

    return userName;
}
