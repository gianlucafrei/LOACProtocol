import { Subject } from "../src/subject";
import { IdentityAuthority } from '../src/identityAuthority';
import { mc } from '../src/main';
import { ProtocolException } from '../src/exceptions';
import { CertificateSigningRequest } from '../src/certificateSigningRequest';

describe('onboarding test', ()=>{

    test('test onboarding', ()=>{

        let subject = new Subject();
        let ia = new IdentityAuthority(1000);

        let req = subject.generateOnboardingRequest('user66');
        let cert = ia.handleOnboaradingRequest(req, 'user66');

        expect(cert).not.toBeNull();
        
        // Test a signature
        let msg = "foobar";
        let sign = mc.sign(msg, subject.sk);
        let isValid = mc.verifySignatureWithCertificate('user66', msg, sign, cert, [ia.pk]);

        expect(isValid).toBe(true);  
    });

    test('test onboarding invalid signature', ()=>{

        let subject = new Subject();
        let otherSubject = new Subject();


        let ia = new IdentityAuthority(1000);
        let req = subject.generateOnboardingRequest('user66');

        // Switch pk, now the signature will not be valid
        let r = CertificateSigningRequest.deserialize(req);
        r.publicKey = otherSubject.pk;
        req = r.serialize();

        expect(() => ia.handleOnboaradingRequest(req, 'user66')).toThrowError(ProtocolException);
    });

    test('test onboarding invalid user', ()=>{

        let subject = new Subject();
        let ia = new IdentityAuthority(1000);
        let req = subject.generateOnboardingRequest('user66');

        expect(() => ia.handleOnboaradingRequest(req, 'user77')).toThrowError(ProtocolException);
    });



});