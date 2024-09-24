import { Button } from "@peerprep/ui/button";
import { Link } from "@peerprep/ui/link";
import { TextInput } from "@peerprep/ui/text-input";
import { getHTTPErrorMessage, userClient } from "@peerprep/utils/client";
import { useState } from "react";
import toast from "react-hot-toast";

import { mutateAuth } from "~/lib/auth";

export default function LoginPage() {
  const [pending, setPending] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form
      className="bg-main-900 flex w-full max-w-lg flex-col gap-6 p-12"
      onSubmit={async e => {
        e.preventDefault();
        if (pending) return;
        setPending(true);
        try {
          await userClient.post("/auth/login", { json: { email, password } });
          await mutateAuth();
          toast.success("Welcome back!");
        } catch (e) {
          toast.error(getHTTPErrorMessage(e));
        }
        setPending(false);
      }}
    >
      <h1 className="text-main-50 text-2xl">Login</h1>
      <TextInput
        label="Email"
        type="email"
        name="email"
        required
        value={email}
        onValueChange={setEmail}
      />
      <TextInput
        label="Password"
        type="password"
        name="password"
        required
        minLength={8}
        maxLength={128}
        value={password}
        onValueChange={setPassword}
      />
      <Button variants={{ variant: "primary" }} type="submit">
        Log in
      </Button>
      <p>
        Or{" "}
        <Link
          href="/register"
          className="text-main-50 font-bold underline-offset-4 hover:underline"
        >
          sign up
        </Link>{" "}
        if you don't have an admin account yet.
      </p>
    </form>
  );
}
