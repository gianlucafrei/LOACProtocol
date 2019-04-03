"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const accessRequest_1 = require("./accessRequest");
const certificateSigningRequest_1 = require("./certificateSigningRequest");
const party_1 = require("./party");
const token_1 = require("./token");
const utils = require("./utils");
const main_1 = require("./main");
class Subject extends party_1.Party {
    generateOnboardingRequest(username) {
        let msg = utils.concat(username, this.pk);
        let s = main_1.mc.sign(msg, this.sk);
        let req = new certificateSigningRequest_1.CertificateSigningRequest();
        req.username = username;
        req.publicKey = this.pk;
        req.signature = s;
        return req;
    }
    issueDelegatedToken(username, delegable, resourceName, validityStart, validityEnd) {
        let nextToken = token_1.Token.signToken(username, delegable, resourceName, validityStart, validityEnd, this.sk);
        return nextToken;
    }
    createAccessRequest(username, description, tokens, certificates) {
        let req = new accessRequest_1.AccessRequest();
        req.time = main_1.mc.now();
        req.description = description;
        let payload = utils.concat(req.time.toString(), req.description);
        req.signature = main_1.mc.sign(payload, this.sk);
        req.certificates = certificates;
        req.tokens = tokens;
        return req;
    }
}
exports.Subject = Subject;
//# sourceMappingURL=subject.js.map