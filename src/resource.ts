import { AccessRequest } from './accessRequest';
import { PreconditionException, ProtocolException } from './exceptions';
import { Globals } from './globals';
import { concat, isSubResourceName, isValidName } from './utils';

/**
 * This class represents a resource. Since a resource has not a secret
 * this class is not a subclass of Party.
 */
export class Resource {

    /**
     * The set of trusted keys to signs public key certificates.
     */
    public trustedIAKeys: string[];

    /**
     * The set of trusted keys to sign authorization tokens.
     */
    public trustedPAKeys: string[];

    /**
     * The maximal allowed derivation between the current time of the resource
     * and time stamp in the access request.
     */
    public timeDerivationThreshold: number;

    /**
     * The name of the resource.
     */
    public name: string;

    /**
     * Creates a new resource
     * @param name The name of the resource
     * @param trustedIAKeys An array of all trusted IA keys
     * @param trustedPAKeys An array of all trusted PA keys
     * @param timeDerivationThreshold The maximal time delta in seconds
     */
    public constructor(name: string, trustedIAKeys: string[], trustedPAKeys: string[], timeDerivationThreshold = 10) {

        if (!isValidName(name))
            throw new PreconditionException("invalid resource name: " + name);

        this.name = name;
        this.trustedIAKeys = trustedIAKeys;
        this.trustedPAKeys = trustedPAKeys;
        this.timeDerivationThreshold = timeDerivationThreshold;
    }

    /**
     * Validates a access request and calls the successCallback with username and description
     * if the request is valid. Otherwise a Exception is thrown.
     * 
     * PreconditionException: The request is not a valid in sense of the serialization
     * ProtocolException:     The request is not valid in sense of the protocol For example a invalid signature
     * 
     * @param req 
     * @param successCallback 
     */
    public checkAccessRequest(req: Buffer | AccessRequest, successCallback) {

        // Prepare Arguments
        if (Buffer.isBuffer(req))
            req = AccessRequest.deserialize(req);
        if (req == null || !req.isValid())
            throw new PreconditionException("Invalid access request");

        const n = req.certificates.length;

        // Timestamp check
        let derivation = req.time - Globals.mc.now();
        if (Math.abs(derivation) > this.timeDerivationThreshold)
            throw new ProtocolException("Time derivation to large");

        // Request signature check
        let payloadCn = concat(this.name, req.time.toString(), req.description);
        let c_n = req.certificates[n - 1]
        let username = Globals.mc.getAuthenticSigner(payloadCn, req.signature, c_n, this.trustedIAKeys);
        if (username == null)
            throw new ProtocolException("Invalid signature in request");

        // Context check
        let tn = req.tokens[n - 1];
        if (req.time < tn.validityStart || req.time > tn.validityEnd)
            throw new ProtocolException("The last token is expired or not yet valid");

        if (!isSubResourceName(this.name, tn.resource))
            throw new ProtocolException("The last token is not valid for this resource");

        // Check the authenticity of the root token
        let c1 = req.certificates[0];
        let u1 = Globals.mc.getUsernameOfCertificate(c1);
        let t1 = req.tokens[0];
        let payloadT1 = concat(
            u1,
            t1.delegable.toString(),
            t1.resource,
            t1.validityStart.toString(),
            t1.validityEnd.toString());
        let pkPa = Globals.mc.recoverSignerPublicKey(payloadT1, t1.signature);
        let paIsTrusted = this.trustedPAKeys.includes(pkPa);

        if (!paIsTrusted)
            throw new ProtocolException("The pa which signed the root token is not trusted");

        // Check the chain of tokens 
        for (let i = 1; i < n; i++) { // Array indexes start with 0

            let currentToken = req.tokens[i];
            let priorToken = req.tokens[i - 1];

            let currentCertificate = req.certificates[i];
            let priorCertificate = req.certificates[i - 1];

            let priorUsername = Globals.mc.getUsernameOfCertificate(priorCertificate);
            let currentUsername = Globals.mc.getUsernameOfCertificate(currentCertificate);

            let payloadTi = concat(
                currentUsername,
                currentToken.delegable.toString(),
                currentToken.resource,
                currentToken.validityStart.toString(),
                currentToken.validityEnd.toString());

            let tokenSignatureIsValid = Globals.mc.verifySignatureWithCertificate(priorUsername, payloadTi, currentToken.signature, priorCertificate, this.trustedIAKeys);

            if (!tokenSignatureIsValid)
                throw new ProtocolException("The signature of the token " + i + " is not valid");

            if (!priorToken.delegable)
                throw new ProtocolException("The token " + i + " allows no delegation");

            if (!currentToken.isSubTokenOf(priorToken))
                throw new ProtocolException("The token " + (i + 1) + "exceeds the privileges of token " + i);
        }

        // Finally if everything as ok we call the success callback
        successCallback(username, req.description);
    }

}