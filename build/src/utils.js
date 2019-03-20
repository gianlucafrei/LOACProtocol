"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const msgpack = require('msgpack-lite');
const BN = require('bn.js');
function concat(...strings) {
    var result = "";
    strings.forEach((s, idx) => {
        result += idx + ":" + s;
    });
    return result;
}
exports.concat = concat;
function hexStringToBuffer(s) {
    const number = new BN(s, 16);
    const buffer = number.toArrayLike(Buffer);
    return buffer;
}
exports.hexStringToBuffer = hexStringToBuffer;
function bufferToHexString(data) {
    const number = new BN(data);
    const hexStr = number.toString(16);
    return hexStr.toString('hex');
}
exports.bufferToHexString = bufferToHexString;
function encodeObj(obj) {
    return msgpack.encode(obj);
}
exports.encodeObj = encodeObj;
function decodeBuf(buf) {
    return msgpack.decode(buf);
}
exports.decodeBuf = decodeBuf;
function isValidResourceWildcardName(name) {
    if (!isString(name))
        return false;
    let result = /^(((\*\.)?([a-zA-Z0-9_]+\.)*([a-zA-Z0-9_]+))|(\*))$/.test(name);
    return result;
}
exports.isValidResourceWildcardName = isValidResourceWildcardName;
function isValidName(name) {
    if (!isString(name))
        return false;
    let result = /^([a-zA-Z0-9_]+\.)*([a-zA-Z0-9_]+)$/.test(name);
    return result;
}
exports.isValidName = isValidName;
function isSubResourceName(child, parent) {
    if (!isValidResourceWildcardName(child) || !isValidResourceWildcardName(parent))
        return false;
    if (parent == '*')
        return true;
    if (child == parent)
        return true;
    if (parent.indexOf('*.') != 0)
        return false;
    let idx = child.indexOf(parent.substring(2, parent.length));
    if (idx <= 0)
        return false;
    return true;
}
exports.isSubResourceName = isSubResourceName;
function isString(obj) {
    return (typeof obj === 'string' || obj instanceof String);
}
exports.isString = isString;
function isHexString(obj) {
    if (!isString(obj))
        return false;
    let s = obj;
    if (s.length % 2 != 0)
        return false;
    return /^[a-fA-F0-9]+$/.test(s);
}
exports.isHexString = isHexString;
//# sourceMappingURL=utils.js.map