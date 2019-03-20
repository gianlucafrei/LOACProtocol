"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
class Party {
    constructor(secret) {
        if (secret == null) {
            this.sk = main_1.mc.newPrivateKey();
        }
        else {
            this.sk = secret;
        }
        this.pk = main_1.mc.computePublicKeyFromPrivateKey(this.sk);
    }
    ;
}
exports.Party = Party;
//# sourceMappingURL=party.js.map