import { HocuspocusProvider } from "@hocuspocus/provider";
import Editor from "@monaco-editor/react";
import { env } from "@peerprep/env";
import { LinkButton } from "@peerprep/ui/button";
import { MarkdownRenderer } from "@peerprep/ui/markdown-renderer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@peerprep/ui/tabs";
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

  return (
    <div className="flex h-full w-full gap-6">
      <div className="bg-main-900 flex w-1/2 flex-grow flex-col gap-6 overflow-auto px-4 pt-2">
        <Tabs defaultValue="problem">
          <TabsList>
            <TabsTrigger value="problem" className="text-sm">
              PROBLEM STATEMENT
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-sm">
              CHAT ROOM
            </TabsTrigger>
          </TabsList>

          <TabsContent value="problem">
            <h1 className="text-2xl font-semibold text-white">{room.question.title}</h1>
            <div className="prose prose-stone prose-invert max-w-full">
              <MarkdownRenderer markdown={room.question.content} />
            </div>
          </TabsContent>
          <TabsContent value="chat">
            <p>Room ID: {id}</p>
          </TabsContent>
        </Tabs>
      </div>

      <div className="bg-main-900 flex w-1/2 flex-grow flex-col px-4 py-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="w-48">
            Language select here
            {/* <Select value={language} onValueChange={value => setLanguage(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="JavaScript">JavaScript</SelectItem>
                <SelectItem value="Python">Python</SelectItem>
                <SelectItem value="Java">Java</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
          <div className="w-48">
            <LinkButton href={room.question.leetCodeLink} variants={{ variant: "primary" }}>
              Submit on Leetcode
            </LinkButton>
          </div>
        </div>

        <div className="flex-grow overflow-auto">
          <style>{stylesheets.join("")}</style>
          <Editor
            height="100%"
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
                  "dummy, required because hocuspocus needs it but we don't do anything with it",
              });
              provider.setAwarenessField("user", {
                username: user.username,
              } satisfies UserAwareness);
              provider.on(
                "awarenessUpdate",
                ({ states }: { states: { clientId: number; user: UserAwareness }[] }) => {
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
      </div>
    </div>
  );
}
