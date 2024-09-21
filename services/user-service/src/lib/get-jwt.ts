import type { JWTPayloadSpec } from "@elysiajs/jwt";

export async function getJwt(
  id: string,
  sign: (morePayload: Record<string, string | number> & JWTPayloadSpec) => Promise<string>,
) {
  return {
    value: await sign({ sub: id }),
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 1 month
  };
}
