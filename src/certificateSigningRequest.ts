import { hexStringToBuffer, bufferToHexString, encodeObj, decodeBuf, Message } from './utils';

/***
 * Represents the first message of the onboarding process
 */
export class CertificateSigningRequest implements Message {

    /**
     * The username belonging to the public key.
     */
    public username: string;

    /**
     * The public key belonging to the username.
     */
    public publicKey: string;

    /**
     * The signature of the request, used to proof the possession of the secret
     * key belonging to the public key.
     */
    public signature: string;


    /**
     * Returns if the certificate singing request object has valid
     * values for all fields
     */
    public isValid(): Boolean {

        return this.publicKey != null && this.username != null && this.signature != null
    }

    /**
     * Converts the certificate singing request to a buffer.
     */
    public serialize(): Buffer {
        let obj = {
            u: this.username,
            p: hexStringToBuffer(this.publicKey),
            s: hexStringToBuffer(this.signature)
        };
        return encodeObj(obj);
    }

    /**
     * Converts a serialized singing request back to an object and returns it
     * if the request is valid, otherwise null is returned.
     * @param buf 
     */
    public static deserialize(buf: Buffer): CertificateSigningRequest {

        try {
            let obj = decodeBuf(buf);
            let req = new CertificateSigningRequest();
            req.username = obj.u;
            req.publicKey = bufferToHexString(obj.p);
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
