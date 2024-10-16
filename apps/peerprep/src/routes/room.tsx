import { useParams } from "react-router-dom";

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("invariant: id is undefined");

  return (
    <div>
      <div className="bg-main-900 flex w-full max-w-lg flex-col gap-6 p-12">{id}</div>
    </div>
  );
}
