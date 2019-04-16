import { Party } from './party';
import { Token } from './token';

/**
 * This class represents a permission authority.
 * The only thing a permission authority does is issuing tokens.
 */
export class PermissionAuthority extends Party {

    /**
     * Signs a authorization token and returns it.
     * @param username The username of the entitled user
     * @param delegable A boolean, indicates if the user is allowed to delegate the token
     * @param resourceName The name of the resource (or wildcard name)
     * @param validityStart The start of the validity as unix time stamp
     * @param validityEnd The end of the validity as unix time stamp
     */
    public issueToken(

        username: string,
        delegable: boolean,
        resourceName: string,
        validityStart: number,
        validityEnd: number): Token {

        let t = Token.signToken(username, delegable, resourceName, validityStart, validityEnd, this.sk);
        return t;
    }
}