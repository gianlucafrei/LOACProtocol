import { Resource } from "../src/resource";
import { Subject } from '../src/subject';
import { PermissionAuthority } from '../src/permissionAuthority';
import { IdentityAuthority } from '../src/identityAuthority';
import { mc } from '../src/main';
import { ProtocolException } from '../src/exceptions';
import { createVerify } from 'crypto';
import { isValidName, concat } from '../src/utils';
import { AccessRequest } from '../src/accessRequest';

describe("Test the access request validation algorithm", ()=>{

    let ia = new IdentityAuthority(1000);
    let pa = new PermissionAuthority();
    let user1 = new Subject();
    let user2 = new Subject();
    let resource = new Resource("resource1", [ia.pk], [pa.pk], 20);
    
    let req1 = user1.generateOnboardingRequest('user1');
    let req2 = user2.generateOnboardingRequest('user2');

    let c1 = ia.handleOnboaradingRequest(req1, 'user1');
    let c2 = ia.handleOnboaradingRequest(req2, 'user2');

    let now = mc.now();

    let t1 = pa.issueToken('user1', true, "resource1", now-1000, now+1000);
    let t2 = user1.issueDelegatedToken('user2', false, "resource1", now-500, now+500);

    let req = user2.createAccessRequest('user2', 'open', [t1, t2], [c1, c2]);

    /**
     * Tests if a valid request verifies as expected
     */
    test('test valid request', ()=>{

        let cb = jest.fn();
        resource.checkAccessRequest(req, cb)
        expect(cb).toHaveBeenCalledWith(req.description);

    });

    /**
     * Tests if the validation fails if the tau field in the request
     * if not fresh 
     */
    test('test invalid time', ()=>{
        let cb = jest.fn();

        // Create an request which was valid 100 seconds before
        let req = new AccessRequest();
        req.time = mc.now()-100;
        req.description = 'open'
        let payload = concat(req.time.toString(), req.description);
        req.signature = mc.sign(payload, user2.sk);
        req.certificates = [c1, c2];
        req.tokens = [t1, t2];

        expect(()=> resource.checkAccessRequest(req, cb)).toThrowError(ProtocolException);
        expect(cb).not.toHaveBeenCalled();

    });

    /**
     * Tests if the validation fails if another user signed the request
     */
    test('test invalid user', ()=>{

        let cb = jest.fn();
        let payload = concat(req.time.toString(), req.description);
        req.signature = mc.sign(payload, user1.sk);

        expect(()=> resource.checkAccessRequest(req, cb)).toThrowError(ProtocolException);
        expect(cb).not.toHaveBeenCalled();
    });

    /**
     * Tests if the validation fails if the signature is invalid
     */
    test('test invalid signature', ()=>{

        let cb = jest.fn();
        req.signature = mc.sign("foobar", user2.sk);
        
        expect(()=> resource.checkAccessRequest(req, cb)).toThrowError(ProtocolException);
        expect(cb).not.toHaveBeenCalled();
    });
    

    /**
     * Tests if the validation fails of the request is valid
     * but not for the resource which checks it
     */
    test('test valid request but false resource', ()=>{

        let cb = jest.fn();
        let otherResource = new Resource("resourceXX", [ia.pk], [pa.pk], 20);

        expect(()=> otherResource.checkAccessRequest(req, cb)).toThrowError(ProtocolException);
        expect(cb).not.toHaveBeenCalled();

    })

    /**
     * Tests if the validation fails if the time
     * within the validity of the last token
     */
    test('test time not in validity of token', ()=>{

        let cb = jest.fn();

        let t1 = pa.issueToken('user1', true, "resource1", now-1000, now-200);
        let t2 = user1.issueDelegatedToken('user2', false, "resource1", now-900, now-300);
        let req = user2.createAccessRequest('user2', 'open', [t1, t2], [c1, c2]);

        expect(()=> resource.checkAccessRequest(req, cb)).toThrowError(ProtocolException);
        expect(cb).not.toHaveBeenCalled();

    });

    test('test invalid signature in root token', ()=>{

    });

    test('test different username in root token', ()=>{

    });

    test('test root token not delegable', ()=>{

    });

    test('test token 2 of 3 not delegable', ()=>{

    });

    test('signature of delegated token not valid', ()=>{

    });


    test('token not delegated by entitled user of the token before', ()=>{

    });
    


    test('test untrusted pa', ()=>{

        let cb = jest.fn();
        let untrustedPA = new PermissionAuthority();
        let new_t1 = untrustedPA.issueToken('user1', true, "resource1", 0, 10000);
        let t2 = user1.issueDelegatedToken('user2', false, "resource1", 100, 9000);

        let req = user2.createAccessRequest('user2', 'open', [new_t1, t2], [c1, c2]);

        expect(()=> resource.checkAccessRequest(req, cb)).toThrowError(ProtocolException);
        expect(cb).not.toHaveBeenCalled();

    });


    

});