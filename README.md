[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bzPrOe11)

# CS3219 Project (PeerPrep) – AY2425S1

**Group: G37**

## Set up

Recommended to use Visual Studio Code as the code editor, though any code editors work.

- Install [Bun](https://bun.sh)
- Install repo dependencies: `bun i` or `bun install`
- If there are any environment variables needed, create `.env` in the root of the repository and add the environment variables there.

## Components of the repository

- `apps`: The frontends applications
- `services`: The microservices
- `packages`: Shared packages

## Develop

> [!NOTE]
> This step might probably change after we containerise the app.

`bun dev` or `bun run dev` from the root of the repository will run all apps and microservices in dev mode. For the Vite apps, in dev mode, changes in the code will be instantly reflected in the browser in real time. For microservices, a refresh is needed.

If you want to run only one particular microservice or app in dev mode, simply `cd` to that app and run `bun dev`.

```
cd apps/peerprep
bun dev
```

## Build

> [!NOTE]
> This step might probably change after we containerise the app.

The dev mode above is not optimised. To build the app for use in production mode (for demo purpose, for deployment, etc.), run `bun run build` from the root of the repository.

## Start

> [!NOTE]
> This step might probably change after we containerise the app.

After building, we can serve all apps and microservices in production mode using `bun start`, also from the root of the repository.

## Ports

- The PeerPrep frontend: 3000
- User service: 3001

## Resources

This project uses React and TypeScript, so you might want to learn more about these technologies if you are not already familiar with them.

Apart from that, it's worth reading about

- [Turborepo](https://turbo.build/repo)
- [Bun](https://bun.sh)
- [Elysia](https://elysiajs.com)
