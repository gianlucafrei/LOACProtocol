import { Resource } from './resource';
import { Subject } from './subject';
import { IdentityAuthority } from './identityAuthority';
import { PermissionAuthority } from './permissionAuthority';
import { Globals } from './globals';

const minicert = require('minicertificates');

/**
 * Initializes the library and returns an object to interact with the library.
 * @param curve The name of the curve to use
 * @param randomFunction A callback for random number generation (See the minicert docs)
 */
export function init(curve, randomFunction?) {

    if (randomFunction == null)
        Globals.mc = new minicert(curve, minicert.insecureRandom);
    else
        Globals.mc = new minicert(curve, randomFunction);

    return {
        Subject: Subject,
        Resource: Resource,
        IdentityAuthority: IdentityAuthority,
        PermissionAuthority: PermissionAuthority,

        utils: {
            dateToUnixTime: (date) => Math.floor(date.getTime() / 1000)
        }
    };
};