import { Party } from './party';
import { Token } from './token';

export class PermissionAuthority extends Party{

    public issueToken(

        username:string,
        delegable:boolean,
        resourceName:string,
        validityStart: number,
        validityEnd: number) : Token {

        let t = Token.signToken(username, delegable, resourceName, validityStart, validityEnd, this.sk);
        return t;
    }
}