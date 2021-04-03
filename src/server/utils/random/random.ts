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
    public getRandomString(length: number): Promise<string> {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(Math.ceil(length/2), (err, buffer) => {
                if (err) {
                    return reject(err);
                }

                return resolve(buffer.toString('hex').slice(0, length));
            });
        })
    }

    /**
     * Generate a random integer
     * @param min 
     * @param max 
     * @returns a random number
     */
    public getRandomInteger(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
}