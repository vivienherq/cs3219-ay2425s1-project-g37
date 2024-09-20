import { Button } from "@peerprep/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";

import { FormControl } from "~/components/form";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="grid h-screen w-screen place-items-center">
      <form className="flex w-full max-w-lg flex-col gap-6 bg-neutral-900 p-12">
        <h1 className="text-2xl">Login</h1>
        <FormControl label="Email" type="email" required value={email} onValueChange={setEmail} />
        <FormControl
          label="Password"
          type="password"
          required
          minLength={8}
          maxLength={128}
          value={password}
          onValueChange={setPassword}
        />
        <Button>Log in</Button>
        <Link to="/register">Register new admin</Link>
      </form>
    </div>
  );
}
