"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resource_1 = require("./resource");
const subject_1 = require("./subject");
const identityAuthority_1 = require("./identityAuthority");
const permissionAuthority_1 = require("./permissionAuthority");
const minicert = require('minicertificates');
module.exports = function (curve, randomFunction) {
    if (randomFunction == null)
        exports.mc = new minicert(curve, minicert.insecureRandom);
    else
        exports.mc = new minicert(curve, randomFunction);
    return {
        Subject: subject_1.Subject,
        Resource: resource_1.Resource,
        IdentityAuthority: identityAuthority_1.IdentityAuthority,
        PermissionAuthority: permissionAuthority_1.PermissionAuthority,
        utils: {
            dateToUnixTime: (date) => Math.floor(date.getTime() / 1000)
        }
    };
};
//# sourceMappingURL=main.js.map