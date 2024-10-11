import { env } from "@peerprep/env";
import { useState } from "react";
import useSWRSubscription, { type SWRSubscriptionOptions } from "swr/subscription";

export default function IndexPage() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const { data } = useSWRSubscription("data", (_, { next }: SWRSubscriptionOptions<string>) => {
    const ws = new WebSocket(`ws://localhost:${env.VITE_MATCHING_SERVICE_PORT}`);
    setWs(ws);
    ws.addEventListener("message", event => next(null, event.data));
    ws.addEventListener("error", () => next("Connection error", undefined));
    return () => {
      if (ws.readyState === 1) ws.close();
      else ws.addEventListener("open", () => ws.close());
    };
  });
  if (!ws) return null;
  return (
    <div>
      <button onClick={() => ws.send(JSON.stringify({ difficulty: "HARD", tags: [] }))}>
        Click me
      </button>
      <div>{data ?? "nothingness"}</div>
    </div>
  );
}
