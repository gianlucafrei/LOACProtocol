"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("./globals");
class Party {
    constructor(secret) {
        if (secret == null) {
            this.sk = globals_1.Globals.mc.newPrivateKey();
        }
        else {
            this.sk = secret;
        }
        this.pk = globals_1.Globals.mc.computePublicKeyFromPrivateKey(this.sk);
    }
    ;
}
exports.Party = Party;
//# sourceMappingURL=party.js.map