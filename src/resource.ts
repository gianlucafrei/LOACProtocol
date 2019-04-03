import { PreconditionException, ProtocolException } from './exceptions';
import { Party } from './party';
import { isValidName, concat, isSubResourceName } from './utils';
import { AccessRequest } from './accessRequest';
import { mc } from './main';

export class Resource{

    public trustedIAKeys: string[];
    public trustedPAKeys: string[];
    public timeDerivationThreshold : number;
    public name: string;

    public constructor(name: string, trustedIAKeys: string[], trustedPAKeys: string[], timeDerivationThreshold=10){

        if(!  isValidName(name))
            throw new PreconditionException("invalid resource name: " + name);

        this.name = name;
        this.trustedIAKeys = trustedIAKeys;
        this.trustedPAKeys = trustedPAKeys;
        this.timeDerivationThreshold = timeDerivationThreshold;
    }

    public checkAccessRequest(req : Buffer | AccessRequest, successCallback){
        
        // Prepare Arguments
        if(Buffer.isBuffer(req))
            req = AccessRequest.deserialize(req);
        if(! req.isValid())
            throw new PreconditionException("Invalid access request");
        
        const n = req.certificates.length;

        // Timestamp check
        let derivation = req.time - mc.now();
        if(Math.abs(derivation) > this.timeDerivationThreshold)
            throw new ProtocolException("Time derivation to large");

        // Request signature check
        let payloadCn = concat(req.time.toString(), req.description);
        let c_n = req.certificates[n-1]
        let username = mc.getAuthenticSigner(payloadCn, req.signature, c_n, this.trustedIAKeys);
        if(username == null)
            throw new ProtocolException("Invalid signature in request");
        
        // Check of the last token
        let tn = req.tokens[n-1];
        if(tn.username != username)
            throw new ProtocolException("The last token does not belong to the signer of the request");

        // Context check
        if(req.time < tn.validityStart || req.time > tn.validityEnd)
            throw new ProtocolException("The last token is expired or not yet valid");
        
        if(! isSubResourceName(this.name, tn.resource))
            throw new ProtocolException("The last token is not valid for this resource");

        // Check the authenticity of the root token
        let t1 = req.tokens[0];
        let payloadT1 = concat(
            t1.username,
            t1.delegable.toString(),
            t1.resource,
            t1.validityStart.toString(),
            t1.validityEnd.toString());
        let pkPa = mc.recoverSignerPublicKey(payloadT1, t1.signature);
        let paIsTrusted = this.trustedPAKeys.includes(pkPa);
        if(! paIsTrusted)
            throw new ProtocolException("The pa which signed the root token is not trusted");

        // Check the chain of tokens 
        for(let i=1; i<n; i++){ // Array indexes start with 0

            let currentToken = req.tokens[i];
            let priorToken = req.tokens[i-1];
            let priorCertificate = req.certificates[i-1];

            let payloadTi = concat(
                currentToken.username,
                currentToken.delegable.toString(),
                currentToken.resource,
                currentToken.validityStart.toString(),
                currentToken.validityEnd.toString());
            let signerT1 = mc.getAuthenticSigner(payloadTi, currentToken.signature, priorCertificate, this.trustedIAKeys);

            if(signerT1 == null)
                throw new ProtocolException("The signature of token " + (i+1) + " is not valid");
            
            if(signerT1 != priorToken.username)
                throw new ProtocolException("The signer of token " + (i+1) + "is not the holder of token " + (i));

            if(! priorToken.delegable)
                throw new ProtocolException("The token " + i + " allows no delegation");
        
            if(! currentToken.isSubTokenOf(priorToken))
                throw new ProtocolException("The token " + (i+1) + "exceeds the privileges of token " + i);
        }
        
        // Finally if everything as ok we call the success callback
        successCallback(req.description);
    }

}