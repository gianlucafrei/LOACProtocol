import {mc} from './main';

/**
 * Represents a base class party.
 */
export abstract class Party{

    public sk: string;
    public pk: string;

    /**
     * Create a new 
     * @param secret 
     */
    public constructor(secret?: string){

        // Set or generate secret
        if(secret == null){
            this.sk = mc.newPrivateKey();
        }
        else{
            this.sk = secret;
        }

        // Recompute public key
        this.pk = mc.computePublicKeyFromPrivateKey(this.sk);
    };
}