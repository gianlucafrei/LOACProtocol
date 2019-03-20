"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const exceptions_1 = require("./exceptions");
const party_1 = require("./party");
const utils_1 = require("./utils");
class Resource extends party_1.Party {
    constructor(secret, name) {
        super(secret);
        if (!utils_1.isValidName(name))
            throw new exceptions_1.PreconditionException("invalid resource name: " + name);
        this.name = name;
    }
    checkAccessRequest(req) {
        throw new exceptions_1.PreconditionException("Not implemented");
    }
}
exports.Resource = Resource;
//# sourceMappingURL=resource.js.map