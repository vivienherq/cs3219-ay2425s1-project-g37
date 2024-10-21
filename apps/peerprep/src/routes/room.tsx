import { HocuspocusProvider } from "@hocuspocus/provider";
import Editor from "@monaco-editor/react";
import { env } from "@peerprep/env";
import { useRoom } from "@peerprep/utils/client";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("invariant: id is undefined");

  const { data: room } = useRoom(id);
  const [{ ytext, provider }] = useState(() => {
    const ydoc = new Y.Doc();
    const provider = new HocuspocusProvider({
      url: `ws://localhost:${env.VITE_COLLABORATION_SERVICE_PORT}`,
      name: id,
      document: ydoc,
    });
    const ytext = ydoc.getText("monaco");
    return { ytext, provider };
  });

  if (!room) return null;

  const { userIds, questionId } = room;

  return (
    <div className="flex w-full flex-row justify-center px-6 py-12">
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
          new MonacoBinding(ytext, editorModel, new Set([editor]), provider.awareness);
        }}
      />
    </div>
  );
}
