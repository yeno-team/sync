import { Server } from 'socket.io';
import { ChatBotModule } from './bot';
import { IChatBotBuilder, IChatBotCommand } from './types';

afterEach(() => {
    jest.clearAllMocks();
})

describe("Chat Bot Module", () => {
    const mockCommandExecute = jest.fn();

    const mockCommands = [
        {
            name: "mock",
            execute: mockCommandExecute
        }
    ] as any as IChatBotCommand[];

    const chatBotModule = new ChatBotModule({
        prefix: "/",
        commands: mockCommands 
    } as any as IChatBotBuilder);

    describe("#onMessage", () => {
        it("should call execute on command that matches the name 'mock'", () => {
            expect.assertions(1);

            return chatBotModule.onMessage({} as any as Server, {
                sender: {
                    socket_id: "mockId",
                    rank: 0,
                    username: "mockUser"
                },
                message: "/mock arg1 arg2",
                roomCode: "mockCode"
            }).then(() => expect(mockCommandExecute).toHaveBeenCalledTimes(1));
        });

        it("should not call execute on any command that doesn't match name 'mock1'", () => {
            expect.assertions(1);

            return chatBotModule.onMessage({} as any as Server, {
                sender: {
                    socket_id: "mockId",
                    rank: 0,
                    username: "mockUser"
                },
                message: "/mock1 arg1 arg2",
                roomCode: "mockCode"
            }).then(() => expect(mockCommandExecute).toHaveBeenCalledTimes(0));
        });

        it("should not call execute on command mock if prefix does not match", () => {
            expect.assertions(1);

            return chatBotModule.onMessage({} as any as Server, {
                sender: {
                    socket_id: "mockId",
                    rank: 0,
                    username: "mockUser"
                },
                message: "!mock arg1 arg2",
                roomCode: "mockCode"
            }).then(() => expect(mockCommandExecute).toHaveBeenCalledTimes(0));
        });
    });
});