"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class CertificateSigningRequest {
    isValid() {
        return this.publicKey != null && this.username != null && this.signature != null;
    }
    serialize() {
        let obj = {
            u: this.username,
            p: utils_1.hexStringToBuffer(this.publicKey),
            s: utils_1.hexStringToBuffer(this.signature)
        };
        return utils_1.encodeObj(obj);
    }
    static copy(other) {
        let req = new CertificateSigningRequest();
        req.username = other.username;
        req.publicKey = other.publicKey;
        req.signature = other.signature;
        if (req.isValid())
            return req;
        else
            return null;
    }
    static deserialize(buf) {
        try {
            let obj = utils_1.decodeBuf(buf);
            let req = new CertificateSigningRequest();
            req.username = obj.u;
            req.publicKey = utils_1.bufferToHexString(obj.p);
            req.signature = utils_1.bufferToHexString(obj.s);
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
exports.CertificateSigningRequest = CertificateSigningRequest;
//# sourceMappingURL=certificateSigningRequest.js.map