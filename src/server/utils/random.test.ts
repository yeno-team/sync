import { RandomUtility } from "./random";

describe("RandomUtility Class", () => {
    describe("#getRandomString", () => {
        it('should return a string with its length being the one provided', async () => {
            const randomUtil = new RandomUtility({});

            const randomStringWithLength1 = await randomUtil.getRandomString(1);
            const randomStringWithLength20 = await randomUtil.getRandomString(20);
            const randomStringWithLength12 = await randomUtil.getRandomString(12);
            const randomStringWithLength5 = await randomUtil.getRandomString(5);
            const randomStringWithLength32 = await randomUtil.getRandomString(32);
            const randomStringWithLength3 = await randomUtil.getRandomString(3);

            expect(randomStringWithLength1).toHaveLength(1);
            expect(randomStringWithLength20).toHaveLength(20);
            expect(randomStringWithLength12).toHaveLength(12);
            expect(randomStringWithLength5).toHaveLength(5);
            expect(randomStringWithLength32).toHaveLength(32);
            expect(randomStringWithLength3).toHaveLength(3);
        });
    });
});