import { Resource } from './resource';
import { Subject } from './subject';
import { IdentityAuthority } from './identityAuthority';
import { PermissionAuthority } from './permissionAuthority';
import { Globals } from './globals';

const minicert = require('minicertificates');

export function init(curve, randomFunction?){

    if(randomFunction == null)
        Globals.mc = new minicert(curve, minicert.insecureRandom);
    else
        Globals.mc = new minicert(curve, randomFunction);

    return{
        Subject: Subject,
        Resource: Resource,
        IdentityAuthority: IdentityAuthority,
        PermissionAuthority: PermissionAuthority,
        
        utils: {
            dateToUnixTime: (date)=>Math.floor(date.getTime() / 1000)
        }
    };
};


/*module.exports = function(curve, randomFunction?){

    
    if(randomFunction == null)
        mc = new minicert(curve, minicert.insecureRandom);
    else
        mc = new minicert(curve, randomFunction);

    return{
        Subject: Subject,
        Resource: Resource,
        IdentityAuthority: IdentityAuthority,
        PermissionAuthority: PermissionAuthority,
        
        utils: {
            dateToUnixTime: (date)=>Math.floor(date.getTime() / 1000)
        }
    };
};

*/