import { Token } from './token';
import { bufferToHexString, decodeBuf, encodeObj, hexStringToBuffer, Message, isHexString, isString } from './utils';
import { IdentityAuthority } from './identityAuthority';

/**
 * This class represents an access request and provides methods to serialize and deserialize
 */
export class AccessRequest implements Message {

    public time: number
    public tokens: Token[]
    public certificates: string[]
    public description: string
    public signature: string

    public isValid(): boolean {

        if (isNaN(this.time))
            return false;

        if (!Array.isArray(this.tokens))
            return false;

        if (!Array.isArray(this.certificates))
            return false;
        
        let invalidTokens = this.tokens.filter(t => !t.isValid());
        if (invalidTokens.length > 0)
            return false;

        let invalidCertificates = this.certificates.filter(c => ! isHexString(c));
        if (invalidCertificates.length > 0)
            return false;

        if (!isString(this.description))
            return false;

        if (!isHexString(this.signature))
            return false;

        return true;
    }

    public serialize(): Buffer {

        let T = this.tokens.map(t => t.serialize());
        let C = this.certificates.map(c => hexStringToBuffer(c));

        let obj = {
            t: this.time,
            T: T,
            C: C,
            d: this.description,
            s: hexStringToBuffer(this.signature)
        }

        return encodeObj(obj);
    }

    public static deserialize(buf: Buffer): AccessRequest {

        let obj = decodeBuf(buf);

        let req = new AccessRequest();
        req.time = obj.t;
        req.tokens = obj.T.map(t => Token.deserialize(t));
        req.certificates = obj.C.map(c => bufferToHexString(c));
        req.description = obj.d;
        req.signature = bufferToHexString(obj.s);

        return req;
    }
}