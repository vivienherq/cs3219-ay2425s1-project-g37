import { env } from "@peerprep/env";
import { Elysia } from "elysia";
import OpenAI from "openai";
import { Readable } from "stream";

interface AiRequestBody {
  prompt: string;
}

const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

const app = new Elysia()
  .get("/status", () => new Response("Online"))
  .post(
    "/ai",
    async ({ body }: { body: AiRequestBody }) => {
      const { prompt } = body;
      if (!prompt) {
        throw new Error("Prompt is required"); // Handle the case when prompt is undefined
      }

      const responseStream = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Use the desired model
        stream: true, // Enable streaming
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      });

      const stream = new Readable({
        async read() {
          // Iterate through the stream of chunks from OpenAI
          for await (const chunk of responseStream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (content) {
              // Push each chunk's content to the readable stream
              this.push(content);
            }
          }
          // Push null to signal the end of the stream
          this.push(null);
        },
      });

      // Return the readable stream as a response
      return stream;
    },
    // new Stream(
    //   openai.chat.completions.create({
    //     model: "gpt-3.5-turbo",
    //     stream: true,
    //     messages: [
    //       {
    //         role: "user",
    //         content: prompt,
    //       },
    //     ],
    //   }),
    // ),
  )
  .listen(env.VITE_AI_SERVICE_PORT);

console.log(`AI service is running at ${app.server?.hostname}:${app.server?.port}`);
