import { env } from "@peerprep/env";
import {
  elysiaAuthPlugin,
  elysiaCorsPlugin,
  elysiaFormatResponsePlugin,
} from "@peerprep/utils/server";
import { Elysia } from "elysia";
import OpenAI from "openai";

interface AiRequestBody {
  prompt: string;
}

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const app = new Elysia()
  .use(elysiaCorsPlugin)
  .use(elysiaFormatResponsePlugin)
  .use(elysiaAuthPlugin)
  .get("/status", () => new Response("Online"))
  .post("/ai", async ({ body }: { body: AiRequestBody }) => {
    const { prompt } = body;
    if (!prompt) {
      throw new Error("Prompt is required");
    }

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      });

      const aiContent =
        response.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";

      return new Response(JSON.stringify({ reply: aiContent }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error generating AI response:", error);
      return new Response(
        JSON.stringify({ reply: "There was an error processing your request." }),
        { headers: { "Content-Type": "application/json" } },
      );
    }
  })
  .listen(env.VITE_AI_SERVICE_PORT);

console.log(`AI service is running at ${app.server?.hostname}:${app.server?.port}`);
