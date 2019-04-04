"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const resource_1 = require("./resource");
const subject_1 = require("./subject");
const identityAuthority_1 = require("./identityAuthority");
const permissionAuthority_1 = require("./permissionAuthority");
const globals_1 = require("./globals");
const minicert = require('minicertificates');
function init(curve, randomFunction) {
    if (randomFunction == null)
        globals_1.Globals.mc = new minicert(curve, minicert.insecureRandom);
    else
        globals_1.Globals.mc = new minicert(curve, randomFunction);
    return {
        Subject: subject_1.Subject,
        Resource: resource_1.Resource,
        IdentityAuthority: identityAuthority_1.IdentityAuthority,
        PermissionAuthority: permissionAuthority_1.PermissionAuthority,
        utils: {
            dateToUnixTime: (date) => Math.floor(date.getTime() / 1000)
        }
    };
}
exports.init = init;
;
//# sourceMappingURL=main.js.map