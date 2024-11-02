import { env } from "@peerprep/env";
import type { Room } from "@peerprep/schemas";
import OpenAI from "openai";
import * as Y from "yjs";

interface ChatMessageType<AI extends boolean = boolean> {
  id: string;
  userId: AI extends false ? string : null;
  timestamp: string;
  content: string;
}

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

function getInitialPrompt(room: Room) {
  return `
You are a helpful assistant.

You are talking with two users in a room. They are collaborating on solving a problem together, and
they may ask you for hints and assistance.

Reply to them in short, helpful, concise messages. If you don't know the answer, do not make guesses
and state clearly that you don't know.

The problem they are solving is:

Title: ${room.question.title}

=== Question ===
${room.question.content}
=== End of question ===

Help them solve the problem together, but do not provide the full solution. Only give them hints and
guidance to help them reach the solution themselves.
`.trim();
}

export async function getCompletion(room: Room, yChatMessages: Y.Array<Y.Map<string>>) {
  const chatMessages: ChatMessageType[] = yChatMessages.toJSON();
  const prompts = chatMessages.map(({ userId, content }) => ({
    role: userId === "ai" || userId === null ? ("assistant" as const) : ("user" as const),
    content,
  }));
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: getInitialPrompt(room) }, ...prompts],
  });
  const aiContent =
    response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
  return aiContent;
}
