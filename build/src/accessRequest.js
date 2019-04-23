"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = require("./token");
const utils_1 = require("./utils");
class AccessRequest {
    isValid() {
        if (isNaN(this.time))
            return false;
        if (!Array.isArray(this.tokens))
            return false;
        if (!Array.isArray(this.certificates))
            return false;
        let invalidTokens = this.tokens.filter(t => !t.isValid());
        if (invalidTokens.length > 0)
            return false;
        let invalidCertificates = this.certificates.filter(c => !utils_1.isHexString(c));
        if (invalidCertificates.length > 0)
            return false;
        if (!utils_1.isString(this.description))
            return false;
        if (!utils_1.isHexString(this.signature))
            return false;
        return true;
    }
    serialize() {
        let T = this.tokens.map(t => token_1.Token.copy(t).serialize());
        let C = this.certificates.map(c => utils_1.hexStringToBuffer(c));
        let obj = {
            t: this.time,
            T: T,
            C: C,
            d: this.description,
            s: utils_1.hexStringToBuffer(this.signature)
        };
        return utils_1.encodeObj(obj);
    }
    static deserialize(buf) {
        try {
            let obj = utils_1.decodeBuf(buf);
            let req = new AccessRequest();
            req.time = obj.t;
            req.tokens = obj.T.map(t => token_1.Token.deserialize(t));
            req.certificates = obj.C.map(c => utils_1.bufferToHexString(c));
            req.description = obj.d;
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
exports.AccessRequest = AccessRequest;
//# sourceMappingURL=accessRequest.js.map