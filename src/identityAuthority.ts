import * as utils from './utils';
import { ProtocolException, PreconditionException } from './exceptions';
import { Party } from './party';
import { CertificateSigningRequest } from "./certificateSigningRequest";
import { mc } from './main';

/**
 * Represents an Identity Authority which is a party with a secret
 */
export class IdentityAuthority extends Party {

    public certificateValidityInSeconds: number;

    /**
     * Creates a new IdentityAuthority object
     * @param validityInSeconds The validity of the issued certificates in seconds
     * @param secret The secret key of the identity authority. If null, a new key will be generated
     */
    public constructor(validityInSeconds: number, secret?: string) {

        super(secret);
        this.certificateValidityInSeconds = validityInSeconds;
    }

    /**
     * Handles a Onboarding request: Checks if the request is valid.
     * Since the onboarding request must be sent over an mutual authenticated channel,
     * the name of the authenticated user must be passed via the authenticated user param.
     * The method will then check if the request is valid for the given user and creates and
     * returns a certificate as a string
     * @param req The onboarding request
     * @param authenticatedUser The username of the currently authentic sender of the request
     */
    public handleOnboaradingRequest(req: Buffer | CertificateSigningRequest, authenticatedUser: String): string {

        // Deserialize if needed and check if the request is valid
        let request : CertificateSigningRequest;
        if(Buffer.isBuffer(req))
            request = CertificateSigningRequest.deserialize(req);
        else
            request = req;

        if(! request.isValid())
            throw new PreconditionException("Invalid request");

        // Check the signature in the request
        let msg = utils.concat(request.username, request.publicKey);
        let signatureIsValid = mc.verifySignatureWithPublicKey(msg, request.signature, request.publicKey);
        if(! signatureIsValid)
            throw new ProtocolException("Invalid signature in CertificateSingingRequest");

        // check if the user does match
        let userIsValid = request.username == authenticatedUser;
        if(! userIsValid)
            throw new ProtocolException("Invalid username in singing request");

        // Sign the certificate
        let validityStart = mc.now();
        let validityEnd = mc.plus(validityStart, 0, 0, 0, 0, 0, this.certificateValidityInSeconds)

        // Sign the certificate
        var cert = mc.signCertificate(
            request.username,
            request.publicKey,
            validityStart,
            validityEnd,
            this.sk
        );

        return cert;
    }

}