import { Prisma, db } from "@peerprep/db";
import type { NewRoom } from "@peerprep/schemas";
import { ExpectedError } from "@peerprep/utils/server";
import { StatusCodes } from "http-status-codes";

// export async function createRoom(room: NewRoom) {
//   try {
//     const createdRoom = await db.room.create({ data: room });
//     return createdRoom.id;
//   } catch (error) {
//     console.error("Error creating room:", error);
//     return false;
//   }
// }

export async function createRoom(room: NewRoom) {
  // Basic validation for required fields
  if (!room.userIds || room.userIds.length === 0) {
    throw new ExpectedError("At least one user ID is required", StatusCodes.BAD_REQUEST);
  }
  if (!room.questionId) {
    throw new ExpectedError("Question ID is required", StatusCodes.BAD_REQUEST);
  }
  if (!room.code || room.code.length < 1) {
    throw new ExpectedError("Code is required", StatusCodes.BAD_REQUEST);
  }
  if (!room.language || room.language.length < 1) {
    throw new ExpectedError("Language is required", StatusCodes.BAD_REQUEST);
  }

  try {
    // Create the room in the database
    const createdRoom = await db.room.create({
      data: room,
    });

    return createdRoom.id;
  } catch (error) {
    // Handle specific database errors
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ExpectedError(
        "Room already exists with the provided details",
        StatusCodes.CONFLICT,
      );
    }
    console.error("Error creating room:", error);
    throw error; // Re-throw error for further handling
  }
}
