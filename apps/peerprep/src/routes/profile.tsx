import { Button, LinkButton } from "@peerprep/ui/button";
import { Input } from "@peerprep/ui/text-input";
import { useAuth, useUpdateUser } from "@peerprep/utils/client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProfileSettingPage() {
  const { data: user } = useAuth();
  const navigate = useNavigate();

  if (!user || !user.id) throw new Error("invariant: user or user.id is undefined");

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { isMutating, trigger } = useUpdateUser(user.id);

  return (
    <div>
      <h1 className="mb-4 text-xl font-bold">Profile Information</h1>
      <form
        className="flex flex-col gap-4"
        onSubmit={async e => {
          e.preventDefault();

          if (password && password !== confirmPassword) {
            toast.error("Passwords do not match!");
            return;
          } else if (password) {
            await trigger({ username, email, password });
          }
          await trigger({ username, email });
          toast.success("Profile updated successfully!");
          navigate("..");
        }}
      >
        <div className="profile-image mb-4">
          <img
            src={user.imageUrl}
            alt={`${user.username}'s profile`}
            className="h-24 w-24 rounded-full object-cover"
          />
        </div>

        <Input
          label="Username"
          type="text"
          required
          pattern="^[a-zA-Z0-9_]{4,32}$"
          value={username}
          onValueChange={setUsername}
          helpText="Only letters, numbers, and underscores are allowed. Must be between 4 and 32 characters."
        />
        <Input label="Email" type="email" required value={email} onValueChange={setEmail} />
        <div className="grid grid-cols-2 gap-6">
          <Input
            label="Password"
            type="password"
            minLength={8}
            maxLength={128}
            value={password}
            onValueChange={setPassword}
            placeholder="Leave blank to keep current password"
            helpText={<>Password must be between 8 and 128 characters long.</>}
          />
          <Input
            label="Confirm Password"
            type="password"
            pattern={password}
            value={confirmPassword}
            onValueChange={setConfirmPassword}
          />
        </div>
        <div className="flex gap-4">
          <Button
            className="w-auto"
            type="submit"
            variants={{ variant: "primary" }}
            disabled={isMutating}
          >
            {isMutating ? "Updating..." : "Update Profile"}
          </Button>
          <LinkButton href=".." className="w-auto">
            Cancel
          </LinkButton>
        </div>
      </form>
    </div>
  );
}
