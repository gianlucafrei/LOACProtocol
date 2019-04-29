# LOACProtocol
Proof of concept for a lightweight offline access control protocol.

This repository contains the library of the LOAC protocol. The library is written in TypeScript and tested with JEST. To run the tests and build the library run:
```
npm run test
npm run build
```

## Example
The following snippet shows how to use this library:

```
// Install package with 'npm install gianlucafrei/MiniCertificates'
// Import the protocol library and init on curve p192
var loac = require('./build/src/main').init('p192'); //require('loacprotocol').init('p192');

// Create the different parties for the demo
let ia = new loac.IdentityAuthority(1000);
let pa = new loac.PermissionAuthority();
let user1 = new loac.Subject();
let user2 = new loac.Subject();
let resource = new loac.Resource("resource1", [ia.pk], [pa.pk], 20);

// Onboarding of both users
let req1 = user1.generateOnboardingRequest('user1');
let req2 = user2.generateOnboardingRequest('user2');
let c1 = ia.handleOnboaradingRequest(req1, 'user1');
let c2 = ia.handleOnboaradingRequest(req2, 'user2');

// Root token and delegation
let now = loac.utils.dateToUnixTime(new Date());
let t1 = pa.issueToken('user1', true, "resource1", now-1000, now+1000);
let t2 = user1.issueDelegatedToken('user2', false, "resource1", now-500, now+500);

// Access Request
let req = user2.createAccessRequest('user2', 'open', [t1, t2], [c1, c2]);
let serializedReq = req.serialize();

console.log("Length of request: " + serializedReq.length + " bytes");

let callback = function(username, action){
    console.log("User " + username + " wants to " + action);
}

resource.checkAccessRequest(serializedReq, callback)
```