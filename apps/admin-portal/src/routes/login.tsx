import { Button } from "@peerprep/ui/button";
import { TextInput } from "@peerprep/ui/text-input";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="grid h-screen w-screen place-items-center">
      <form
        className="bg-main-900 flex w-full max-w-lg flex-col gap-6 p-12"
        onSubmit={e => {
          e.preventDefault();
          // log in
        }}
      >
        <h1 className="text-main-50 text-2xl">Login</h1>
        <TextInput label="Email" type="email" required value={email} onValueChange={setEmail} />
        <TextInput
          label="Password"
          type="password"
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
            to="/register"
            className="text-main-50 font-bold underline-offset-4 hover:underline"
          >
            sign up
          </Link>{" "}
          if you don't have an admin account yet.
        </p>
      </form>
    </div>
  );
}
