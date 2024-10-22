import { HocuspocusProvider } from "@hocuspocus/provider";
import Editor from "@monaco-editor/react";
import { env } from "@peerprep/env";
import { useAuth, useRoom } from "@peerprep/utils/client";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";

interface UserAwareness {
  username: string;
}

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("invariant: id is undefined");

  const { data: user } = useAuth();
  const { data: room, error } = useRoom(id);

  const [stylesheets, setStylesheets] = useState<string[]>([]);

  if (error) return <Navigate to="/" />;
  if (!user || !room) return null;

  const { userIds, questionId } = room;

  return (
    <div className="flex w-full flex-row justify-center px-6 py-12">
      <style>{stylesheets.join("")}</style>
      <div className="bg-main-900 flex w-full max-w-lg flex-col gap-6 p-12">
        <p>Room ID: {id}</p>
        <p>Matched Users: {userIds.join(", ")}</p>
        <p>Question ID: {questionId}</p>
      </div>
      <Editor
        height="90vh"
        theme="vs-dark"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onMount={editor => {
          const editorModel = editor.getModel();
          if (!editorModel)
            throw new Error("invariant: monaco editor model is null, this shouldn't happen");
          const ydoc = new Y.Doc();
          const provider = new HocuspocusProvider({
            url: `ws://localhost:${env.VITE_COLLABORATION_SERVICE_PORT}`,
            name: id,
            document: ydoc,
            token:
              "dummy token, i dont need this but i must send because hocuspocus requires it for some reasons",
          });
          provider.setAwarenessField("user", { username: user.username } satisfies UserAwareness);
          provider.on(
            "awarenessUpdate",
            ({ states }: { states: { clientId: number; user: UserAwareness }[] }) => {
              console.log(states);
              const newStylesheets = states.map(({ clientId, user: awarenessUser }) => {
                const colour = user.username === awarenessUser.username ? "#a855f7" : "#f59e0b";
                const stylesheet = `
                  .yRemoteSelection-${clientId} {
                    background-color: ${colour}60;
                  }
                  .yRemoteSelectionHead-${clientId} {
                    position: absolute;
                    border-left: ${colour} solid 2px;
                    border-top: ${colour} solid 2px;
                    border-bottom: ${colour} solid 2px;
                    height: 100%;
                    box-sizing: border-box;
                  }
                `.trim();
                return stylesheet;
              });
              setStylesheets(newStylesheets);
            },
          );
          const ytext = ydoc.getText("monaco");
          new MonacoBinding(ytext, editorModel, new Set([editor]), provider.awareness);
        }}
      />
    </div>
  );
}
