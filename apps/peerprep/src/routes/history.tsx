import { Link } from "@peerprep/ui/link";
import { useAuth, useUserHistory } from "@peerprep/utils/client";

export default function HistoryPage() {
  const { data: user } = useAuth();
  if (!user) throw new Error("invariant: user is undefined");

  const { data: history } = useUserHistory(user.id);
  if (!history) return null;
  return (
    <div className="container py-6 pb-12">
      <h1 className="text-main-50 text-2xl">Your History</h1>
      <div className="mt-6">
        {history.length === 0 ? (
          <p>It's empty in here. Go match with someone now!</p>
        ) : (
          <ul>
            {history.map(room => (
              <li key={room.id} className="flex items-center gap-4 p-2">
                <div className="flex flex-col">
                  <span className="text-main-500 text-base">{room.question.title}</span>
                  <span className="text-main-400 text-sm">
                    {room.question.createdAt.toLocaleDateString()}
                  </span>
                </div>
                <Link href={`/room/${room.id}`} className="btn-secondary">
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
