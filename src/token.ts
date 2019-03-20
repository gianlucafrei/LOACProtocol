import { concat, hexStringToBuffer, encodeObj, decodeBuf, bufferToHexString, isSubResourceName, Message, isValidName, isValidResourceWildcardName, isHexString } from './utils';
import { mc } from './main';
import { PreconditionException } from './exceptions';

/**
 * Represents a authorization token
 */
export class Token implements Message{

    public username: string;
    public delegable: boolean;
    public resource: string;
    public validityStart: number;
    public validityEnd: number;
    public signature: string;

    private constructor(){}

    /**
     * Creates a new token by signing
     * @param username 
     * @param delegable 
     * @param resource 
     * @param validityStart 
     * @param validityEnd 
     * @param secret 
     */
    public static signToken(
        username:string,
        delegable:boolean,
        resource:string,
        validityStart: number,
        validityEnd: number,
        secret: string):Token{

        // Sign the payload
        let payload = concat(
            username,
            delegable.toString(),
            resource,
            validityStart.toString(),
            validityEnd.toString());

        let signature = mc.sign(payload, secret);

        // Return a new token object
        let t = new Token();
        t.username = username;
        t.delegable = delegable;
        t.resource = resource;
        t.validityStart = validityStart;
        t.validityEnd = validityEnd;
        t.signature = signature;
        return t;
    }

    public isValid(): boolean{

        if(!isValidName(this.username)) return false;
        if(typeof this.delegable != 'boolean') return false;
        if(!isValidResourceWildcardName(this.resource)) return false;
        if(isNaN(this.validityStart)) return false;
        if(isNaN(this.validityEnd)) return false;

        if(!isHexString(this.signature)) return false;
        if(this.validityEnd < this.validityStart) return false;

        return true;
    }

    public serialize() : Buffer{

        let obj = {
            u: this.username,
            d: this.delegable,
            r: this.resource,
            t: this.validityStart,
            e: this.validityEnd,
            s: hexStringToBuffer(this.signature)
        };

        return encodeObj(obj);
    }

    public static deserialize(buf: Buffer){

        let obj = decodeBuf(buf);
        let t = new Token();

        t.username = obj.u;
        t.delegable = obj.d;
        t.resource = obj.r;
        t.validityStart = obj.t;
        t.validityEnd = obj.e;
        t.signature = bufferToHexString(obj.s);

        return t;
    }

    /**
     * Test if the privileges of this token don't exceed
     * the privileges of the other token
     * @param other The other token
     */
    public isSubTokenOf(other: Token){

        // Test if other is delegable
        if(! other.delegable) return false;
        if(! isSubResourceName(this.resource, other.resource)) return false;
        if(other.validityStart > this.validityStart) return false;
        if(other.validityEnd < this.validityEnd) return false;
        return true;
    }
}