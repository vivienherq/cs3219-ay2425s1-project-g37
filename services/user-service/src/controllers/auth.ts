import { db } from "@peerprep/db";
import { ExpectedError } from "@peerprep/utils";

export async function handleLogin(email: string, password: string) {
  const GENERIC_ERROR = new ExpectedError("Invalid email or password");

  const user = await db.user.findUnique({ where: { email } });
  if (!user) throw GENERIC_ERROR;

  const isValid = await Bun.password.verify(password, user.password);
  if (!isValid) throw GENERIC_ERROR;

  return user.id;
}
