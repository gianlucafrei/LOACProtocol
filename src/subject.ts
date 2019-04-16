import { AccessRequest } from './accessRequest';
import { CertificateSigningRequest } from "./certificateSigningRequest";
import { Party } from './party';
import { Token } from './token';
import * as utils from './utils';
import { Globals } from './globals';

/**
 * This class represents a subject.
 */
export class Subject extends Party {

    /**
     * Signs a onboarding request for the username given as a parameter
     * @param username The username for which the certificate will be issued
     */
    public generateOnboardingRequest(username: string): CertificateSigningRequest {

        // Create new keys and sign certificate request
        let msg = utils.concat(username, this.pk);
        let s = Globals.mc.sign(msg, this.sk);

        // Create the request object
        let req = new CertificateSigningRequest();
        req.username = username;
        req.publicKey = this.pk;
        req.signature = s;

        // return the secret and request object
        return req;
    }

    /**
     * Creates a delegated token
     * @param username The username of the next user
     * @param delegable A flag if the next user is allowed to further delegate the token
     * @param resourceName The name of the resource (wildcard is possible)
     * @param validityStart The start of the validity period as unix time stamp
     * @param validityEnd  The end of the validity period as unix time stamp
     */
    public issueDelegatedToken(
        username: string,
        delegable: boolean,
        resourceName: string,
        validityStart: number,
        validityEnd: number): Token {

        let nextToken = Token.signToken(username, delegable, resourceName, validityStart, validityEnd, this.sk);
        return nextToken;
    }

    /**
     * Signs a new access request
     * @param resourceName The name of the resource which the user wants to access
     * @param description The additional access parameters as a string
     * @param tokens The authorization tokens
     * @param certificates The public key certificates
     */
    public createAccessRequest(
        resourceName: string,
        description: string,
        tokens: Token[],
        certificates: string[]
    ): AccessRequest {

        let req = new AccessRequest();
        req.time = Globals.mc.now();
        req.description = description

        let payload = utils.concat(resourceName, req.time.toString(), req.description);
        req.signature = Globals.mc.sign(payload, this.sk);

        req.certificates = certificates;
        req.tokens = tokens;

        return req;
    }
}