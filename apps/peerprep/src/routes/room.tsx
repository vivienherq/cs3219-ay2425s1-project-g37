import { HocuspocusProvider } from "@hocuspocus/provider";
import Editor from "@monaco-editor/react";
import { env } from "@peerprep/env";
import type { Room, User } from "@peerprep/schemas";
import { Avatar } from "@peerprep/ui/avatar";
import { LinkButton } from "@peerprep/ui/button";
import { Link } from "@peerprep/ui/link";
import { MarkdownRenderer } from "@peerprep/ui/markdown-renderer";
import { QuestionDifficultyLabel } from "@peerprep/ui/question-difficulty-label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@peerprep/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@peerprep/ui/tabs";
import { useAuth, useRoom } from "@peerprep/utils/client";
import { Tags } from "lucide-react";
import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useY } from "react-yjs";
import { MonacoBinding } from "y-monaco";
import * as Y from "yjs";

import { NavAvatar } from "~/components/nav-avatar";
import { NavLogo } from "~/components/nav-logo";
import { generateContext } from "~/lib/generate-context";

interface UserAwareness {
  username: string;
}

const ydoc = new Y.Doc();
const yCodeContent = ydoc.getText("monaco");
const yLanguage = ydoc.getText("language");
const [PageDataProvider, usePageData] = generateContext<{ user: User; room: Room }>("room data");

function getTagString(tags: string[]) {
  if (tags.length >= 4) return `${tags.slice(0, 3).join(", ")}, +${tags.length - 3}`;
  return tags.join(", ");
}

function useHocuspocus() {
  const { user, room } = usePageData();

  const [stylesheets, setStylesheets] = useState<string[]>([]);
  const [provider] = useState(() => {
    const provider = new HocuspocusProvider({
      url: `ws://localhost:${env.VITE_COLLABORATION_SERVICE_PORT}`,
      name: room.id,
      document: ydoc,
      token: "dummy, required because hocuspocus needs it but we don't do anything with it",
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
    return provider;
  });
  return { provider, stylesheets };
}

function Navbar() {
  const { user, room } = usePageData();
  const collaborator = room.users[0].id === user.id ? room.users[1] : room.users[0];
  return (
    <nav className="flex flex-row justify-between p-6">
      <div className="flex flex-row items-center gap-6">
        <NavLogo />
        <div className="flex flex-col">
          <h1 className="text-2xl font-semibold text-white">
            <Link href={room.question.leetCodeLink}>{room.question.title}</Link>
          </h1>
          <div className="flex flex-row items-center gap-6">
            <QuestionDifficultyLabel difficulty={room.question.difficulty} />
            <div className="text-main-500 flex flex-row items-center gap-1.5 text-sm">
              <Tags />
              <span>{getTagString(room.question.tags)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-9">
        <div className="flex flex-row items-center gap-3">
          <Avatar
            imageUrl={collaborator.imageUrl}
            username={collaborator.username}
            className="size-9 border-4 border-amber-500"
          />
          <div className="flex flex-col">
            <span>@{collaborator.username}</span>
            <span className="text-main-500 text-xs uppercase">Collaborator</span>
          </div>
        </div>
        <LinkButton href="/" variants={{ variant: "secondary" }} className="w-fit">
          End session
        </LinkButton>
        <NavAvatar />
      </div>
    </nav>
  );
}

function LanguageSelector() {
  const language = useY(yLanguage) as unknown as string;
  return (
    <Select
      value={language || "javascript"}
      onValueChange={value => {
        yLanguage.delete(0, yLanguage.length);
        yLanguage.insert(0, value);
      }}
    >
      <SelectTrigger size="sm" className="w-48">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="javascript">JavaScript</SelectItem>
        <SelectItem value="python">Python</SelectItem>
        <SelectItem value="java">Java</SelectItem>
      </SelectContent>
    </Select>
  );
}

function MainRoomPage() {
  const { room } = usePageData();
  const { provider, stylesheets } = useHocuspocus();
  return (
    <div className="flex h-screen w-screen flex-col px-6">
      <Navbar />
      <div className="grid min-h-0 flex-grow grid-cols-2 gap-6 p-6 pt-0">
        <Tabs className="bg-main-900 flex flex-col gap-6 overflow-y-auto" defaultValue="problem">
          <TabsList className="p-6 pb-0">
            <TabsTrigger value="problem" className="text-sm">
              Problem statement
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-sm">
              Chat room
            </TabsTrigger>
          </TabsList>
          <TabsContent value="problem" className="flex-grow overflow-y-auto p-6 pt-0">
            <div className="prose prose-stone prose-invert max-w-full">
              <MarkdownRenderer markdown={room.question.content} />
            </div>
          </TabsContent>
          <TabsContent value="chat" className="flex-grow overflow-y-auto p-6 pt-0">
            <p>Room ID: {room.id}</p>
          </TabsContent>
        </Tabs>
        <div className="bg-main-900 flex flex-col gap-6 p-6">
          <div className="flex flex-row items-center justify-between">
            <LanguageSelector />
            <LinkButton
              className="w-fit"
              href={room.question.leetCodeLink}
              variants={{ variant: "primary", size: "sm" }}
            >
              Submit on Leetcode
            </LinkButton>
          </div>

          <div className="flex-grow">
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
                new MonacoBinding(yCodeContent, editorModel, new Set([editor]), provider.awareness);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoomPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) throw new Error("invariant: id is undefined");

  const { data: user } = useAuth();
  const { data: room, error } = useRoom(id);

  if (error) return <Navigate to="/" />;
  if (!user || !room) return null;
  return (
    <PageDataProvider value={{ user, room }}>
      <MainRoomPage />
    </PageDataProvider>
  );
}
