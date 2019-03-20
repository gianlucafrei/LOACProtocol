"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const party_1 = require("./party");
const token_1 = require("./token");
class PermissionAuthority extends party_1.Party {
    issueToken(username, delegable, resourceName, validityStart, validityEnd) {
        let t = token_1.Token.signToken(username, delegable, resourceName, validityStart, validityEnd, this.sk);
        return t;
    }
}
exports.PermissionAuthority = PermissionAuthority;
//# sourceMappingURL=permissionAuthority.js.map