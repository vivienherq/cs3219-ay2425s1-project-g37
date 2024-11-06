import { useAuth } from "@peerprep/utils/client";
import { Link } from "@peerprep/ui/link";
import { useEffect, useState } from "react";

export default function HistoryPage() {
    const { data: user } = useAuth();
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        if (user) {
            fetch(`http://localhost:3000/${user.id}/history`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Error fetching history: ${response.statusText}`);
                    }
                    const contentType = response.headers.get('Content-Type');
                    if (contentType && contentType.includes('application/json')) {
                        return response.json();
                    } else {
                        throw new Error('Response is not JSON');
                    }
                })
                .then((data) => setHistory(data))
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [user]);

    if (!user) return null;

    return (
        <div className="container py-6 pb-12">
            <h1 className="text-2xl text-main-50">Your History</h1>
            <div className="mt-6">
                {history.length === 0 ? (
                    <p>No history available.</p>
                ) : (
                    <ul>
                        {history.map((item) => (
                            <li key={item.id} className="flex items-center gap-4 p-2">
                                <div className="flex flex-col">
                                    <span className="text-base text-main-500">{item.title}</span>
                                    <span className="text-sm text-main-400">{item.date}</span>
                                </div>
                                <Link href={`/history/${item.id}`} className="btn-secondary">
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