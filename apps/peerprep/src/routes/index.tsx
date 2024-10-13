import { env } from "@peerprep/env";
import type { Difficulty } from "@peerprep/schemas";
import { useWsSubscription } from "@peerprep/utils/client";
import MatchmakingForm from "./matchmakingform";

export default function IndexPage() {
  const ws = useWsSubscription<
    { difficulty: Difficulty; tags: string[] },
    { type: "success" } | { type: "acknowledgement" } | { type: "timeout" }
  >("matching:/", `ws://localhost:${env.VITE_MATCHING_SERVICE_PORT}`);
  
  if (!ws.isReady) return null;

  const handleMatchmaking = (difficulty: Difficulty, tags: string[]) => {
    ws.send({ difficulty, tags });
  }

  return (
    <div>
      <MatchmakingForm onMatchmaking={handleMatchmaking} /> 
      <div>{ws.data?.type ?? "No responses so far"}</div>
    </div>
  );
}
