import { IdentityAuthority } from "../src/identityAuthority";
import { PermissionAuthority } from '../src/permissionAuthority';
import { Subject } from '../src/subject';
import { AccessRequest } from '../src/accessRequest';


describe('test access request', ()=>{

    let ia = new IdentityAuthority(1000);
    let pa = new PermissionAuthority();
    let user1 = new Subject();
    let user2 = new Subject();

    let req1 = user1.generateOnboardingRequest('user1');
    let req2 = user2.generateOnboardingRequest('user2');

    let c1 = ia.handleOnboaradingRequest(req1, 'user1');
    let c2 = ia.handleOnboaradingRequest(req2, 'user2');

    let t1 = pa.issueToken('user1', true, "resource1", 0, 10000);
    let t2 = user1.issueDelegatedToken('user2', false, "resource1", 100, 9000);

    let req = user2.createAccessRequest('user2', 'open', [t1, t2], [c1, c2]);

    test('test deserialized equals serialized', ()=>{

        expect(req.isValid()).toBe(true);
        let serialized = req.serialize();

        let length = serialized.length;

        let deserialized = AccessRequest.deserialize(serialized);
        expect(deserialized.isValid()).toBe(true);

        expect(deserialized.time).toEqual(req.time);
        expect(deserialized.certificates).toEqual(req.certificates);
        expect(deserialized.signature).toEqual(req.signature);
        expect(deserialized.tokens).toEqual(req.tokens);
    });


})