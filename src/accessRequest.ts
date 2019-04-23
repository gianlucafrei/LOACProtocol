import { Token } from './token';
import { bufferToHexString, decodeBuf, encodeObj, hexStringToBuffer, isHexString, isString, Message } from './utils';

/**
 * This class represents an access request and provides methods to serialize and deserialize it
 */
export class AccessRequest implements Message {

    /**
     * This field contains the time of the request
     */
    public time: number

    /**
     * The list of authorization tokens
     */
    public tokens: Token[]

    /**
     * The list of public key certificates
     */
    public certificates: string[]

    /**
     * The additional access parameters
     */
    public description: string

    /**
     * The signature of the reqest
     */
    public signature: string

    /**
     * Checks if the request als valid values for all fields
     */
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

        let invalidCertificates = this.certificates.filter(c => !isHexString(c));
        if (invalidCertificates.length > 0)
            return false;

        if (!isString(this.description))
            return false;

        if (!isHexString(this.signature))
            return false;

        return true;
    }

    /**
     * Converts the access request to a buffer object
     */
    public serialize(): Buffer {

        let T = this.tokens.map(t => Token.copy(t).serialize());
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

    /**
     * Converts a serialized access request to an access request object
     * or returns null if the request is not valid
     * @param buf 
     */
    public static deserialize(buf: Buffer): AccessRequest {

        try {

            let obj = decodeBuf(buf);
            let req = new AccessRequest();
            req.time = obj.t;
            req.tokens = obj.T.map(t => Token.deserialize(t));
            req.certificates = obj.C.map(c => bufferToHexString(c));
            req.description = obj.d;
            req.signature = bufferToHexString(obj.s);

            if (req.isValid())
                return req;
            else
                return null;
        }
        catch (err) {
            return null;
        }
    }
}