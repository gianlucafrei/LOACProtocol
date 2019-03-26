import { AccessRequest } from './accessRequest';
import { CertificateSigningRequest } from "./certificateSigningRequest";
import { Party } from './party';
import { Token } from './token';
import * as utils from './utils';
import { mc } from './main';


export class Subject extends Party {

    public generateOnboardingRequest(username: string): CertificateSigningRequest {

        // Create new keys and sign certificate request
        let msg = utils.concat(username, this.pk);
        let s = mc.sign(msg, this.sk);

        // Create the request object
        let req = new CertificateSigningRequest();
        req.username = username;
        req.publicKey = this.pk;
        req.signature = s;

        // return the secret and request object
        return req;
    }

    public issueDelegatedToken(
        username: string,
        delegable: boolean,
        resourceName: string,
        validityStart: number,
        validityEnd: number): Token {

        let nextToken = Token.signToken(username, delegable, resourceName, validityStart, validityEnd, this.sk);
        return nextToken;
    }

    public createAccessRequest(
        username: string,
        description: string,
        tokens: Token[],
        certificates: string[]
    ): AccessRequest {

        let req = new AccessRequest();
        req.time = mc.now();
        req.description = description

        let payload = utils.concat(req.time.toString(), req.description);
        req.signature = mc.sign(payload, this.sk);

        req.certificates = certificates;
        req.tokens = tokens;

        return req;
    }
}