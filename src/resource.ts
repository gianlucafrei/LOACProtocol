import { PreconditionException } from './exceptions';
import { Party } from './party';
import { isValidName } from './utils';
import { AccessRequest } from './accessRequest';

export class Resource extends Party{

    public name: string;

    public constructor(secret: string | null, name: string){

        super(secret);

        if(!  isValidName(name))
            throw new PreconditionException("invalid resource name: " + name);

        this.name = name;
    }

    public checkAccessRequest(req : Buffer){
        
        throw new PreconditionException("Not implemented");

    }

}