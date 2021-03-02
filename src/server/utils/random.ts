import crypto from 'crypto';


/**
 * Dependencies for ControllerUtility class
 */
export type RandomUtilityDependencies = {
    
}

/**
 * Utility functions to help with randomness
 */
export class RandomUtility {
    /**
     * Sets the dependencies type as a private variable of the class
     * @param dependencies 
     */
    constructor(
        private dependencies: RandomUtilityDependencies
    ) {}

    /**
     * Generates a random string by length
     * @param length 
     */
    public getRandomString(length: number) {
        return crypto.randomBytes(length).toString('hex');
    }
}