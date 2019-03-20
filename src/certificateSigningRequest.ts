import { hexStringToBuffer, bufferToHexString, encodeObj, decodeBuf, Message } from './utils';

/***
 * Represents the first message of the onboarding process
 */
export class CertificateSigningRequest implements Message{

    public username: string;
    public publicKey: string;
    public signature: string;


    public isValid(): Boolean{

        return this.publicKey != null && this.username != null && this.signature != null
    }

    /**
     *
     */
    public serialize(): Buffer {
        let obj = {
            u: this.username,
            p: hexStringToBuffer(this.publicKey),
            s: hexStringToBuffer(this.signature)
        };
        return encodeObj(obj);
    }
    public static deserialize(buf: Buffer): CertificateSigningRequest {
        let obj = decodeBuf(buf);
        let req = new CertificateSigningRequest();
        req.username = obj.u;
        req.publicKey = bufferToHexString(obj.p);
        req.signature = bufferToHexString(obj.s);
        return req;
    }
}
