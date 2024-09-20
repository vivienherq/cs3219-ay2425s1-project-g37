import { Button } from "@peerprep/ui/button";
import { TextInput } from "@peerprep/ui/text-input";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminSignupToken, setAdminSignupToken] = useState("");
  return (
    <div className="grid h-screen w-screen place-items-center">
      <form
        className="bg-main-900 flex w-full max-w-lg flex-col gap-6 p-12"
        onSubmit={e => {
          e.preventDefault();
          // sign up
        }}
      >
        <h1 className="text-main-50 text-2xl">Register</h1>
        <TextInput
          label="Username"
          type="text"
          name="username"
          required
          pattern="^[a-zA-Z0-9_]{4,32}$"
          value={username}
          onValueChange={setUsername}
          helpText="Only letters, numbers, and underscores are allowed. Must be between 4 and 32 characters."
        />
        <TextInput
          label="Email"
          type="email"
          name="email"
          required
          value={email}
          onValueChange={setEmail}
        />
        <div className="grid grid-cols-2 gap-6">
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
          <TextInput
            label="Confirm Password"
            type="password"
            name="confirm-password"
            required
            pattern={password}
            value={confirmPassword}
            onValueChange={setConfirmPassword}
          />
        </div>
        <TextInput
          label="Admin Signup Token"
          type="password"
          required
          value={adminSignupToken}
          onValueChange={setAdminSignupToken}
          helpText="Value of the ADMIN_SIGNUP_TOKEN environment variable. If you don't have this token, you cannot create an admin account."
        />
        <Button variants={{ variant: "primary" }} type="submit">
          Sign up
        </Button>
        <p>
          Or{" "}
          <Link to="/login" className="text-main-50 font-bold underline-offset-4 hover:underline">
            log in
          </Link>{" "}
          if you already have an admin account.
        </p>
      </form>
    </div>
  );
}
