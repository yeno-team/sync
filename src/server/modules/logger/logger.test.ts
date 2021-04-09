import { Logger } from './logger';

const logger = new Logger();

afterEach(() => {
    jest.clearAllMocks();
})

describe("Logger Module", () => {
    it("should log message when called", () => {
        const log = jest.spyOn(console, 'log').mockImplementationOnce(jest.fn());;

        logger.log("mock");

        expect(log).toHaveBeenCalled;
        expect(log).toHaveBeenLastCalledWith("mock");
    });

    it("should warn message when called", () => {
        const log = jest.spyOn(console, 'warn').mockImplementationOnce(jest.fn());

        logger.warn("mock");

        expect(log).toHaveBeenCalled;
        expect(log).toHaveBeenLastCalledWith("mock");
    });

    it("should error message when called", () => {
        const log = jest.spyOn(console, 'error').mockImplementation(jest.fn());

        logger.error("mock");

        expect(log).toHaveBeenCalled;
        expect(log).toHaveBeenLastCalledWith("mock");
    });
})