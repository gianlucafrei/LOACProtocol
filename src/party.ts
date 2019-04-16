import { Globals } from './globals';

/**
 * This is a base class for an object holding a secret key like subjects and authorities.
 */
export abstract class Party {

    /**
     * The secret key of the party as a string.
     */
    public sk: string;

    /**
     * The public key of the party as a string.
     */
    public pk: string;

    /**
     * Create a new instance, must be called by subclasses.
     * If a secret is provided this is used as the private key.
     * If the secret is null, a new secret will be generated.
     * @param secret The secret key as string or null
     */
    public constructor(secret?: string) {

        // Set or generate secret
        if (secret == null) {
            this.sk = Globals.mc.newPrivateKey();
        }
        else {
            this.sk = secret;
        }

        // Recompute public key
        this.pk = Globals.mc.computePublicKeyFromPrivateKey(this.sk);
    };
}