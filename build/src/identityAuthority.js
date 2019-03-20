"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils = require("./utils");
const exceptions_1 = require("./exceptions");
const party_1 = require("./party");
const certificateSigningRequest_1 = require("./certificateSigningRequest");
const main_1 = require("./main");
class IdentityAuthority extends party_1.Party {
    constructor(validityInSeconds, secret) {
        super(secret);
        this.certificateValidityInSeconds = validityInSeconds;
    }
    handleOnboaradingRequest(req, authenticatedUser) {
        let request;
        if (Buffer.isBuffer(req))
            request = certificateSigningRequest_1.CertificateSigningRequest.deserialize(req);
        else
            request = req;
        if (!request.isValid())
            throw new exceptions_1.PreconditionException("Invalid request");
        let msg = utils.concat(request.username, request.publicKey);
        let signatureIsValid = main_1.mc.verifySignatureWithPublicKey(msg, request.signature, request.publicKey);
        if (!signatureIsValid)
            throw new exceptions_1.ProtocolException("Invalid signature in CertificateSingingRequest");
        let userIsValid = request.username == authenticatedUser;
        if (!userIsValid)
            throw new exceptions_1.ProtocolException("Invalid username in singing request");
        let validityStart = main_1.mc.now();
        let validityEnd = main_1.mc.plus(validityStart, 0, 0, 0, 0, 0, this.certificateValidityInSeconds);
        var cert = main_1.mc.signCertificate(request.username, request.publicKey, validityStart, validityEnd, this.sk);
        return cert;
    }
}
exports.IdentityAuthority = IdentityAuthority;
//# sourceMappingURL=identityAuthority.js.map