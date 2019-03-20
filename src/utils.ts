const msgpack = require('msgpack-lite');
const BN = require('bn.js');

/**
 * Concats an array of string in a unambiguous manner
 * concat("foo", "bar") => "1:foo2:bar"
 * @param strings 
 */
export function concat(...strings: string[]): string {

    var result = ""

    strings.forEach((s, idx) => {
        result += idx + ":" + s;
    });

    return result;

}

/**
 * Converts a hex string into a buffer object
 * @param s The hex string
 */
export function hexStringToBuffer(s: string): Buffer {

    const number = new BN(s, 16);
    const buffer = number.toArrayLike(Buffer)
    return buffer
}

/**
 * Converts a buffer object into a hex string
 * @param data The buffer
 */
export function bufferToHexString(data: Buffer): string {

    const number = new BN(data);
    const hexStr = number.toString(16);
    return hexStr.toString('hex');
}

/**
 * Serializes a object into a buffer
 * @param obj 
 */
export function encodeObj(obj: any): Buffer {
    return msgpack.encode(obj);
}

/**
 * Deserializes a buffer into an object
 * Expects a serialized object
 * @param buf The serialized object
 */
export function decodeBuf(buf: Buffer): any {
    return msgpack.decode(buf);
}

/**
 * Tests if a given string is a valid name for a resource
 * valid names are for example: *, *.foo, foo, foo.bar,...
 * @param name The name of the resource
 */
export function isValidResourceWildcardName(name:string){

    if(!isString(name)) return false;

    let result = /^(((\*\.)?([a-zA-Z0-9_]+\.)*([a-zA-Z0-9_]+))|(\*))$/.test(name);
    return result;
}

export function isValidName(name:string){

    if(!isString(name)) return false;

    let result = /^([a-zA-Z0-9_]+\.)*([a-zA-Z0-9_]+)$/.test(name);
    return result;
}

export function isSubResourceName(child: string, parent:string){

    if(!isValidResourceWildcardName(child) || !isValidResourceWildcardName(parent))
        return false;

    if(parent == '*') return true;
    if(child == parent) return true;

    // check that parent has *. at start
    if(parent.indexOf('*.') != 0) return false;


    let idx = child.indexOf(parent.substring(2, parent.length));
    if(idx <= 0) 
        return false;

    return true;
}

export function isString(obj: any){

    return (typeof obj === 'string' || obj instanceof String)
}

export function isHexString(obj: any){

    if(!isString(obj)) return false;

    let s : string = obj;

    // Check if string has even length
    if(s.length % 2 != 0)
        return false;

    return /^[a-fA-F0-9]+$/.test(s);
}

/**
 * Simple interface for all messages like
 * singingRequest and AccessRequests and so on
 */
export interface Message {
    
    serialize() : Buffer;
    isValid(): Boolean;

}