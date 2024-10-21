import { useRoom } from "@peerprep/utils/client";
import { useParams } from "react-router-dom";

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("invariant: id is undefined");

  const { data: room } = useRoom(id);
  if (!room) return null;

  const { userIds, questionId } = room;

  return (
    <div className="flex w-full flex-row justify-center px-6 py-12">
      <div className="bg-main-900 flex w-full max-w-lg flex-col gap-6 p-12">
        <p>Room ID: {id}</p>
        <p>Matched Users: {userIds.join(", ")}</p>
        <p>Question ID: {questionId}</p>
      </div>
    </div>
  );
}
