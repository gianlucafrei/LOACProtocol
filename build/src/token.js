"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const globals_1 = require("./globals");
class Token {
    constructor() { }
    static signToken(username, delegable, resource, validityStart, validityEnd, secret) {
        let payload = utils_1.concat(username, delegable.toString(), resource, validityStart.toString(), validityEnd.toString());
        let signature = globals_1.Globals.mc.sign(payload, secret);
        let t = new Token();
        t.username = username;
        t.delegable = delegable;
        t.resource = resource;
        t.validityStart = validityStart;
        t.validityEnd = validityEnd;
        t.signature = signature;
        return t;
    }
    isValid() {
        if (!utils_1.isValidName(this.username))
            return false;
        if (typeof this.delegable != 'boolean')
            return false;
        if (!utils_1.isValidResourceWildcardName(this.resource))
            return false;
        if (isNaN(this.validityStart))
            return false;
        if (isNaN(this.validityEnd))
            return false;
        if (!utils_1.isHexString(this.signature))
            return false;
        if (this.validityEnd < this.validityStart)
            return false;
        return true;
    }
    serialize() {
        let obj = {
            u: this.username,
            d: this.delegable,
            r: this.resource,
            t: this.validityStart,
            e: this.validityEnd,
            s: utils_1.hexStringToBuffer(this.signature)
        };
        return utils_1.encodeObj(obj);
    }
    static deserialize(buf) {
        let obj = utils_1.decodeBuf(buf);
        let t = new Token();
        t.username = obj.u;
        t.delegable = obj.d;
        t.resource = obj.r;
        t.validityStart = obj.t;
        t.validityEnd = obj.e;
        t.signature = utils_1.bufferToHexString(obj.s);
        return t;
    }
    isSubTokenOf(other) {
        if (!other.delegable)
            return false;
        if (!utils_1.isSubResourceName(this.resource, other.resource))
            return false;
        if (other.validityStart > this.validityStart)
            return false;
        if (other.validityEnd < this.validityEnd)
            return false;
        return true;
    }
}
exports.Token = Token;
//# sourceMappingURL=token.js.map