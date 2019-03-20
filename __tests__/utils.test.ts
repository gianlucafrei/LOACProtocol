import * as utils from '../src/utils';

describe('utils test', ()=>{


    test('test concat', ()=>{

        var result = utils.concat("foo", "bar");
        expect(result).toEqual("0:foo1:bar");
    });

    test('test resource wildcard name check', ()=>{

        // Valid ones
        expect(utils.isValidResourceWildcardName('*')).toBe(true);
        expect(utils.isValidResourceWildcardName('foo')).toBe(true);
        expect(utils.isValidResourceWildcardName('*.foo')).toBe(true);
        expect(utils.isValidResourceWildcardName('*.foo.bar')).toBe(true);
        expect(utils.isValidResourceWildcardName('*.foo.foo.foo.foo.foo.foo.foo')).toBe(true);
        expect(utils.isValidResourceWildcardName('*.bar_foo_bar_')).toBe(true);
        expect(utils.isValidResourceWildcardName('_')).toBe(true);

        // invalid
        expect(utils.isValidResourceWildcardName('foo bar')).toBe(false);
        expect(utils.isValidResourceWildcardName('fo%o')).toBe(false);
        expect(utils.isValidResourceWildcardName('foo.*bar')).toBe(false);
        expect(utils.isValidResourceWildcardName('foo.*.bar')).toBe(false);
        expect(utils.isValidResourceWildcardName('foo.*')).toBe(false);
        expect(utils.isValidResourceWildcardName('')).toBe(false);
    });

    test('test resource name check', ()=>{

        // Valid ones
        expect(utils.isValidName('foo')).toBe(true);
        expect(utils.isValidName('_')).toBe(true);
        expect(utils.isValidName('foo.bar')).toBe(true);
        expect(utils.isValidName('foo.bar.foo')).toBe(true);


        // invalid
        expect(utils.isValidName('*.foo')).toBe(false);
        expect(utils.isValidName('*.foo.bar')).toBe(false);
        expect(utils.isValidName('*.foo.foo.foo.foo.foo.foo.foo')).toBe(false);
        expect(utils.isValidName('*.bar_foo_bar_')).toBe(false);
        expect(utils.isValidName('*')).toBe(false);
        expect(utils.isValidName('foo bar')).toBe(false);
        expect(utils.isValidName('fo%o')).toBe(false);
        expect(utils.isValidName('foo.*bar')).toBe(false);
        expect(utils.isValidName('foo.*.bar')).toBe(false);
        expect(utils.isValidName('foo.*')).toBe(false);
        expect(utils.isValidName('')).toBe(false);
    });

    test('test sub resource name check', ()=>{

        expect(utils.isSubResourceName('foo', '*')).toBe(true);
        expect(utils.isSubResourceName('foo', 'foo')).toBe(true);
        expect(utils.isSubResourceName('foo.bar', '*.bar')).toBe(true);
        expect(utils.isSubResourceName('*.foo.bar', '*.bar')).toBe(true);
        expect(utils.isSubResourceName('foo.bar.xzs', '*.bar.xzs')).toBe(true);


        expect(utils.isSubResourceName('foo', 'bar')).toBe(false);
        expect(utils.isSubResourceName('bar.foo', '*.bar')).toBe(false);
        expect(utils.isSubResourceName('bar', '*.bar')).toBe(false);
        expect(utils.isSubResourceName('foo.foo', '*.bar')).toBe(false);

    });

    test("test is hex string", ()=>{

        expect(utils.isHexString('deadbeef0011')).toBe(true);
        expect(utils.isHexString('foobar')).toBe(false);
        expect(utils.isHexString(23)).toBe(false);

    })

})