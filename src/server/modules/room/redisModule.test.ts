import { Logger } from "../logger/logger";
import { RedisModule } from "../redis/redisModule";
import { IPromisifedRedisClient } from "../redis/types";
import { RoomRedisModule } from "./redisModule";
import { IRoom, RoomUser } from "./types";

afterEach(() => {
  jest.clearAllMocks();
});

describe("Room Redis Module", () => {
  const mockRooms: IRoom[] = [
    {
      code: "mockCode",
      name: "mockName",
      description: "mockDesc",
      max_users: 5,
      users: [],
      room_password: "mockPass",
      video_src: "",
      is_private: false,
    },
    {
      code: "mockCode2",
      name: "mockName2",
      description: "mockDesc2",
      max_users: 5,
      users: [],
      room_password: "mockPass2",
      video_src: "",
      is_private: false,
    },
    {
      code: "mockCode3",
      name: "mockName3",
      description: "mockDesc3",
      max_users: 5,
      users: [
        {
          socket_id: "mockId",
          rank: 0,
          username: "mockUser",
        },
      ],
      room_password: "mockPass3",
      video_src: "",
      is_private: true,
    },
  ];

  describe("#getRoomList", () => {
    const _clientMock = ({
      hvalsAsync: jest.fn(() => mockRooms.map((room) => JSON.stringify(room))),
    } as any) as IPromisifedRedisClient;

    const roomModule = new RoomRedisModule({
      redis: ({
        dependencies: {
          logger: (jest.fn() as any) as Logger,
        },
        getClient: jest.fn(() => _clientMock),
      } as any) as RedisModule,
    });

    it("should return a list of IRooms in the database", async () => {
      const roomList = await roomModule.getRoomList();

      expect(roomList).toStrictEqual(mockRooms);
    });
  });

  describe("#addRoom", () => {
    const _clientMock = ({
      hsetAsync: jest.fn(
        (roomKeys, code, value) =>
          new Promise((resolve, reject) => {
            const found = mockRooms.find((room) => room.code === code);

            if (found) {
              resolve(0);
            }

            resolve(1);
          })
      ),
    } as any) as IPromisifedRedisClient;

    const roomModule = new RoomRedisModule({
      redis: ({
        dependencies: {
          logger: (jest.fn() as any) as Logger,
        },
        getClient: jest.fn(() => _clientMock),
      } as any) as RedisModule,
    });

    it("should resolve with room data if the room can be added successfully", async () => {
      expect.assertions(1);

      const mockNewData = ({ code: "newRoomMock" } as any) as IRoom;

      return roomModule
        .addRoom(mockNewData)
        .then((roomData) => expect(roomData).toStrictEqual(mockNewData));
    });

    it("should reject if the room was already found in the database", () => {
      expect.assertions(1);

      // already in the database
      const mockNewData = ({ code: "mockCode3" } as any) as IRoom;

      return roomModule
        .addRoom(mockNewData)
        .then(() => fail())
        .catch((e) =>
          expect(e).toStrictEqual(
            "Unexpected error occured while hset command executed"
          )
        );
    });
  });

  describe("#removeRoom", () => {
    const _clientMock = ({
      hdelAsync: jest.fn(
        (roomKey, code) =>
          new Promise((resolve, reject) => {
            const found = mockRooms.find((room) => room.code === code);

            if (found) {
              return resolve(1);
            }

            resolve(0);
          })
      ),
    } as any) as IPromisifedRedisClient;

    const roomModule = new RoomRedisModule({
      redis: ({
        dependencies: {
          logger: (jest.fn() as any) as Logger,
        },
        getClient: jest.fn(() => _clientMock),
      } as any) as RedisModule,
    });

    it("should resolve if room code exists and can be removed", async () => {
      expect.assertions(0);

      return await roomModule.removeRoom("mockCode3");
    });

    it("should reject if room code does not exist in the database", async () => {
      expect.assertions(1);

      return roomModule
        .removeRoom("mockRandom")
        .catch((e) =>
          expect(e).toStrictEqual(
            "Unexpected error occured while hdel command executed"
          )
        );
    });
  });

  describe("#getRoom", () => {
    const _clientMock = ({
      hgetAsync: jest.fn(
        (roomKey, code) =>
          new Promise((resolve, reject) => {
            const found = mockRooms.find((room) => room.code === code);

            if (found) {
              return resolve(JSON.stringify(found));
            }

            resolve(null);
          })
      ),
    } as any) as IPromisifedRedisClient;

    const roomModule = new RoomRedisModule({
      redis: ({
        dependencies: {
          logger: (jest.fn() as any) as Logger,
        },
        getClient: jest.fn(() => _clientMock),
      } as any) as RedisModule,
    });

    it.each(["mockCode", "mockCode2", "mockCode3"])(
      "should return the roomData with room code %s",
      async (roomCode) => {
        expect.assertions(1);

        const room = await roomModule.getRoom(roomCode);

        expect(room.code).toStrictEqual(roomCode);
      }
    );

    it("should resolve null if the room does not exist", async () => {
      expect.assertions(1);

      return roomModule
        .getRoom("doesNotExist")
        .then((resp) => expect(resp).toBeNull());
    });
  });

  describe("#editRoom", () => {
    const _clientMock = ({
      hsetAsync: jest.fn(
        (roomKeys, code, value) =>
          new Promise((resolve, reject) => {
            const found = mockRooms.find((room) => room.code === code);

            if (found) {
              resolve(0);
            }

            resolve(1);
          })
      ),
      hgetAsync: jest.fn(
        (roomKey, code) =>
          new Promise((resolve, reject) => {
            const found = mockRooms.find((room) => room.code === code);

            if (found) {
              return resolve(JSON.stringify(found));
            }

            resolve(null);
          })
      ),
    } as any) as IPromisifedRedisClient;

    const roomModule = new RoomRedisModule({
      redis: ({
        dependencies: {
          logger: (jest.fn() as any) as Logger,
        },
        getClient: jest.fn(() => _clientMock),
      } as any) as RedisModule,
    });

    it("should resolve with the edited room data if it edited successfully", () => {
      expect.assertions(1);

      return roomModule.editRoom("mockCode3", "name", "mock").then((room) =>
        expect(room).toMatchInlineSnapshot(`
          Object {
            "code": "mockCode3",
            "description": "mockDesc3",
            "is_private": true,
            "max_users": 5,
            "name": "mock",
            "room_password": "mockPass3",
            "users": Array [
              Object {
                "rank": 0,
                "socket_id": "mockId",
                "username": "mockUser",
              },
            ],
            "video_src": "",
          }
        `)
      );
    });

    it("should reject if the setting name does not exist in IRoom type", () => {
      expect.assertions(1);

      return roomModule
        .editRoom("mockCode3", "randomSetting", "mock")
        .catch((e) =>
          expect(e).toMatchInlineSnapshot(`"editRoom: Unknown data name"`)
        );
    });

    it("should reject if the room code does not match any rooms in database", () => {
      expect.assertions(1);

      return roomModule
        .editRoom("mockCode4", "randomSetting", "mock")
        .catch((e) =>
          expect(e).toMatchInlineSnapshot(`"editRoom: Room does not exist"`)
        );
    });
  });

  describe("#appendUser", () => {
    const _clientMock = ({
      hsetAsync: jest.fn(
        (roomKeys, code, value) =>
          new Promise((resolve, reject) => {
            const found = mockRooms.find((room) => room.code === code);

            if (found) {
              resolve(0);
            }

            resolve(1);
          })
      ),
      hgetAsync: jest.fn(
        (roomKey, code) =>
          new Promise((resolve, reject) => {
            const found = mockRooms.find((room) => room.code === code);

            if (found) {
              return resolve(JSON.stringify(found));
            }

            resolve(null);
          })
      ),
    } as any) as IPromisifedRedisClient;

    const roomModule = new RoomRedisModule({
      redis: ({
        dependencies: {
          logger: (jest.fn() as any) as Logger,
        },
        getClient: jest.fn(() => _clientMock),
      } as any) as RedisModule,
    });

    it("should resolve with the updated room data if the user can be appended", () => {
      expect.assertions(1);

      return roomModule
        .appendUser("mockCode3", ({} as any) as RoomUser)
        .then((roomData) =>
          expect(roomData).toMatchInlineSnapshot(`
            Object {
              "code": "mockCode3",
              "description": "mockDesc3",
              "is_private": true,
              "max_users": 5,
              "name": "mockName3",
              "room_password": "mockPass3",
              "users": Array [
                Object {
                  "rank": 0,
                  "socket_id": "mockId",
                  "username": "mockUser",
                },
                Object {},
              ],
              "video_src": "",
            }
          `)
        );
    });

    it("should reject if the room does not exist", () => {
      expect.assertions(1);

      return roomModule
        .appendUser("mockCode4", ({} as any) as RoomUser)
        .catch((e) =>
          expect(e).toMatchInlineSnapshot(`"editRoom: Room does not exist"`)
        );
    });
  });

  describe("#removeUser", () => {
    const _clientMock = ({
      hsetAsync: jest.fn(
        (roomKeys, code, value) =>
          new Promise((resolve, reject) => {
            const found = mockRooms.find((room) => room.code === code);

            if (found) {
              resolve(0);
            }

            resolve(1);
          })
      ),
      hgetAsync: jest.fn(
        (roomKey, code) =>
          new Promise((resolve, reject) => {
            const found = mockRooms.find((room) => room.code === code);

            if (found) {
              return resolve(JSON.stringify(found));
            }

            resolve(null);
          })
      ),
    } as any) as IPromisifedRedisClient;

    const roomModule = new RoomRedisModule({
      redis: ({
        dependencies: {
          logger: (jest.fn() as any) as Logger,
        },
        getClient: jest.fn(() => _clientMock),
      } as any) as RedisModule,
    });

    it("should resolve with updated room data if it can remove user successfully", () => {
      expect.assertions(1);

      return roomModule.removeUser("mockCode3", "mockId").then((roomData) =>
        expect(roomData).toMatchInlineSnapshot(`
          Object {
            "code": "mockCode3",
            "description": "mockDesc3",
            "is_private": true,
            "max_users": 5,
            "name": "mockName3",
            "room_password": "mockPass3",
            "users": Array [],
            "video_src": "",
          }
        `)
      );
    });

    it("should reject if the room does not exist", () => {
      expect.assertions(1);

      return roomModule
        .removeUser("mockCode4", "mockId")
        .catch((e) =>
          expect(e).toMatchInlineSnapshot(`"editRoom: Room does not exist"`)
        );
    });
  });
});
