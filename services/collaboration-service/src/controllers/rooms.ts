import { db } from "@peerprep/db";
import type { Room } from "@peerprep/schemas";
import { ExpectedError } from "@peerprep/utils/server";
import { StatusCodes } from "http-status-codes";

export async function getRoom(roomId: string): Promise<Room> {
  if (roomId.length !== 24) throw new ExpectedError("Invalid room ID", StatusCodes.BAD_REQUEST);
  const room = await db.room.findUnique({ where: { id: roomId } });
  if (!room) throw new ExpectedError("Room not found", StatusCodes.NOT_FOUND);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userIds, ydoc, ...rest } = room;
  if (userIds.length !== 2) throw new Error("invariant: Room must have exactly 2 users");
  return { ...rest, userIds: [userIds[0], userIds[1]] };
}

export async function getYDocFromRoom(roomId: string): Promise<Uint8Array | null> {
  const room = await db.room.findUnique({ where: { id: roomId } });
  // This should only be run when the user has already accessed the room and the room is valid
  if (!room) throw new Error("invariant: The room cannot be found in the database");
  return room.ydoc;
}

export async function storeYDocToRoom(roomId: string, ydoc: Uint8Array) {
  await db.room.update({ where: { id: roomId }, data: { ydoc: Buffer.from(ydoc) } });
}
