import { Database } from "@hocuspocus/extension-database";
import { Server } from "@hocuspocus/server";
import { env } from "@peerprep/env";
import express from "express";
import "express-async-errors";
import expressWebsockets from "express-ws";

import { getRoom, getYDocFromRoom, storeYDocToRoom } from "~/controllers/rooms";
import { corsMiddleware } from "~/middlewares/cors";
import { formatResponse } from "~/middlewares/format-response";
import { handleError } from "~/middlewares/handle-error";

const server = Server.configure({
  onChange: async ({ document }) => {
    // Can use this to e.g. trigger chatgpt on a new chat item
    console.log("Changed", document.getText("monaco").toJSON());
  },
  extensions: [
    new Database({
      fetch: ({ documentName }) => getYDocFromRoom(documentName),
      store: ({ documentName, state }) => storeYDocToRoom(documentName, state),
    }),
  ],
});

const { app } = expressWebsockets(express());

app.use(corsMiddleware);
app.use(formatResponse);

app.get("/status", (_, res) => void res.send("Online"));

app.get("/rooms/:id", async (req, res) => void res.superjson(await getRoom(req.params.id)));

app.ws("/", (ws, req) => server.handleConnection(ws, req));

app.use(handleError);

app.listen(env.VITE_COLLABORATION_SERVICE_PORT, () => {
  console.log(
    `Collaboration service is running at localhost:${env.VITE_COLLABORATION_SERVICE_PORT}`,
  );
});
