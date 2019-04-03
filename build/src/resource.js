"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("./exceptions");
const utils_1 = require("./utils");
const accessRequest_1 = require("./accessRequest");
const main_1 = require("./main");
class Resource {
    constructor(name, trustedIAKeys, trustedPAKeys, timeDerivationThreshold = 10) {
        if (!utils_1.isValidName(name))
            throw new exceptions_1.PreconditionException("invalid resource name: " + name);
        this.name = name;
        this.trustedIAKeys = trustedIAKeys;
        this.trustedPAKeys = trustedPAKeys;
        this.timeDerivationThreshold = timeDerivationThreshold;
    }
    checkAccessRequest(req, successCallback) {
        if (Buffer.isBuffer(req))
            req = accessRequest_1.AccessRequest.deserialize(req);
        if (!req.isValid())
            throw new exceptions_1.PreconditionException("Invalid access request");
        const n = req.certificates.length;
        let derivation = req.time - main_1.mc.now();
        if (Math.abs(derivation) > this.timeDerivationThreshold)
            throw new exceptions_1.ProtocolException("Time derivation to large");
        let payloadCn = utils_1.concat(req.time.toString(), req.description);
        let c_n = req.certificates[n - 1];
        let username = main_1.mc.getAuthenticSigner(payloadCn, req.signature, c_n, this.trustedIAKeys);
        if (username == null)
            throw new exceptions_1.ProtocolException("Invalid signature in request");
        let tn = req.tokens[n - 1];
        if (tn.username != username)
            throw new exceptions_1.ProtocolException("The last token does not belong to the signer of the request");
        if (req.time < tn.validityStart || req.time > tn.validityEnd)
            throw new exceptions_1.ProtocolException("The last token is expired or not yet valid");
        if (!utils_1.isSubResourceName(this.name, tn.resource))
            throw new exceptions_1.ProtocolException("The last token is not valid for this resource");
        let t1 = req.tokens[0];
        let payloadT1 = utils_1.concat(t1.username, t1.delegable.toString(), t1.resource, t1.validityStart.toString(), t1.validityEnd.toString());
        let pkPa = main_1.mc.recoverSignerPublicKey(payloadT1, t1.signature);
        let paIsTrusted = this.trustedPAKeys.includes(pkPa);
        if (!paIsTrusted)
            throw new exceptions_1.ProtocolException("The pa which signed the root token is not trusted");
        for (let i = 1; i < n; i++) {
            let currentToken = req.tokens[i];
            let priorToken = req.tokens[i - 1];
            let priorCertificate = req.certificates[i - 1];
            let payloadTi = utils_1.concat(currentToken.username, currentToken.delegable.toString(), currentToken.resource, currentToken.validityStart.toString(), currentToken.validityEnd.toString());
            let signerT1 = main_1.mc.getAuthenticSigner(payloadTi, currentToken.signature, priorCertificate, this.trustedIAKeys);
            if (signerT1 == null)
                throw new exceptions_1.ProtocolException("The signature of token " + (i + 1) + " is not valid");
            if (signerT1 != priorToken.username)
                throw new exceptions_1.ProtocolException("The signer of token " + (i + 1) + "is not the holder of token " + (i));
            if (!priorToken.delegable)
                throw new exceptions_1.ProtocolException("The token " + i + " allows no delegation");
            if (currentToken.isSubTokenOf(priorToken))
                throw new exceptions_1.ProtocolException("The token " + (i + 1) + "exceeds the privileges of token " + i);
        }
        successCallback(req.description);
    }
}
exports.Resource = Resource;
//# sourceMappingURL=resource.js.map