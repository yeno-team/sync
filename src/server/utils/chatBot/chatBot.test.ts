

import { text } from "express";
import { Server } from "socket.io";
import { RoomChatNewMessage } from "src/server/api/room/subscribers/chat";
import { RoomUserRank } from "src/server/modules/room/types";
import { ChatBotUtility } from "./chatBot";

const chatBotUtility = new ChatBotUtility({});

describe("ChatBotUtility", () => {
  describe("#parseRoomMessageData", () => {
    test("returns correct parsed from the provided message", () => {
      const mockMessageData: RoomChatNewMessage = {
        sender: {
          socket_id: "sadad",
          rank: 0,
          username: "mock",
        },
        message: "/mock mockArg1",
        roomCode: "mock",
      };

      const parsedData = chatBotUtility.parseRoomMessageData(mockMessageData);

      expect(parsedData).toMatchInlineSnapshot(`
        Object {
          "args": Array [
            "mockArg1",
          ],
          "prefix": "/",
        }
      `);
    });
  });

  describe("#sendMessage", () => {
    test("emits event RoomChatNewMessage with provided data", () => {
        const mockIn = jest.fn(() => mockSocket);
        const mockEmit = jest.fn(() => mockSocket);

        const mockSocket = {
            in: mockIn,
            emit: mockEmit
        }
        
        chatBotUtility.sendMessage(mockSocket as any as Server, "mockCode", "mockMessage");
        
        expect(mockIn).toBeCalled();
        expect(mockEmit).toBeCalled();
        expect(mockEmit.mock.calls[0][0]).toBe("RoomChatNewMessage");
        expect(mockEmit.mock.calls[0][1]).toEqual<RoomChatNewMessage>({
            sender: {
                socket_id: "0",
                rank: RoomUserRank.bot,
                username: "Sync"
            },
            roomCode: "mockCode",
            message: "mockMessage"
        });
    });
  });
});
