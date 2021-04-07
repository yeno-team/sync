import { RandomUtility } from "./random";
const randomUtil = new RandomUtility({});

function defuse(promise) {
  promise.catch(() => {});
  return promise;
}

describe("RandomUtility Class", () => {
  beforeEach(() => {
    jest.spyOn(global.Math, "random").mockReturnValue(0.2);
  });

  afterEach(() => {
    jest.spyOn(global.Math, "random").mockRestore();
  });

  describe("#getRandomString", () => {
    it.each([1, 20, 12, 5, 32, 3])(
      "should return a string with a length of %i",
      async (length) => {
        const string = await randomUtil.getRandomString(length);
        expect(string).toHaveLength(length);
      }
    );

    it("should reject if there is an error", async () => {
      await expect(
        randomUtil.getRandomString(-2)
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"The value of \\"size\\" is out of range. It must be >= 0 && <= 4294967295. Received -1"`
      );
    });
  });

  describe("#getRandomInteger", () => {
    it("should return a number", () => {
      expect(
        typeof randomUtil.getRandomInteger(0, 10) === "number"
      ).toBeTruthy();
    });

    it.each([
      [0, 4],
      [5, 2983],
      [8, 23],
      [2, 500],
      [-2, 3],
    ])("should return a number in range of %i and %i", (min, max) => {
      const randomInteger = randomUtil.getRandomInteger(min, max);
      expect(randomInteger > min && randomInteger <= max);
    });

    it.each([
      [-2, -4],
      [1, 0],
      [28287, 2],
      [0.3, 0.1],
      [0, -1],
      [0, 0],
    ])(
      "should throw an error if %i is greater than or equal to %i",
      (min, max) => {
        expect(() => randomUtil.getRandomInteger(min, max)).toThrow(
          "RandomUtility: Minimum number cannot be greater than or equal to max"
        );
      }
    );
  });
});
