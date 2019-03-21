import { Subject } from "../src/subject";
import { IdentityAuthority } from '../src/identityAuthority';
import { mc } from '../src/main';
import { ProtocolException } from '../src/exceptions';
import { CertificateSigningRequest } from '../src/certificateSigningRequest';

describe('onboarding test', ()=>{

    let subject = new Subject();
    let ia = new IdentityAuthority(1000);

    test('test onboarding', ()=>{

        

        let req = subject.generateOnboardingRequest('user66');
        let cert = ia.handleOnboaradingRequest(req, 'user66');

        expect(cert).not.toBeNull();
        
        // Test a signature
        let msg = "foobar";
        let sign = mc.sign(msg, subject.sk);
        let isValid = mc.verifySignatureWithCertificate('user66', msg, sign, cert, [ia.pk]);

        expect(isValid).toBe(true);  
    });

    test('test signing request serialization', ()=>{

        let req = subject.generateOnboardingRequest('user66');
        let serialized = req.serialize();
        let copy = CertificateSigningRequest.deserialize(serialized);

        expect(copy.publicKey).toEqual(req.publicKey);
        expect(copy.signature).toEqual(req.signature);
        expect(copy.username).toEqual(req.username);

    });

    test('test onboarding invalid signature', ()=>{

        let otherSubject = new Subject();

        let req = subject.generateOnboardingRequest('user66');
        req.publicKey = otherSubject.pk;

        expect(() => ia.handleOnboaradingRequest(req, 'user66')).toThrowError(ProtocolException);
    });

    test('test onboarding invalid user', ()=>{

        let req = subject.generateOnboardingRequest('user66');
        expect(() => ia.handleOnboaradingRequest(req, 'user77')).toThrowError(ProtocolException);
    });



});