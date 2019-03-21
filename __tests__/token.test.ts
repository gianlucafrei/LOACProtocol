import { PermissionAuthority } from "../src/permissionAuthority";
import { Subject } from '../src/subject';

describe("test tokens", ()=>{

    let pa = new PermissionAuthority();
    let user = new Subject();

    test('Test is subtoken', ()=>{

        let t1 = pa.issueToken('user1', true, '*.departement1', 0, 10000);

        // Valid delegation
        let t2 = user.issueDelegatedToken('user3', false, 'car33.departement1', 500, 600);
        expect(t2.isSubTokenOf(t1)).toBe(true);

        // Invalid resource
        let t3 = user.issueDelegatedToken('user3', false, 'car33.departement999', 500, 600);
        expect(t3.isSubTokenOf(t1)).toBe(false);

        // Invalid time
        let t4 = user.issueDelegatedToken('user3', false, 'car33.departement1', 500, 9999999);
        expect(t4.isSubTokenOf(t1)).toBe(false);

        // not delegable
        let t5 = pa.issueToken('user1', false, '*.departement1', 0, 10000);
        let t6 = user.issueDelegatedToken('user3', false, 'car33.departement1', 500, 600);
        expect(t6.isSubTokenOf(t5)).toBe(false);
    });

});