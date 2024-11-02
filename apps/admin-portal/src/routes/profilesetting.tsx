import type { UpdateUser } from "@peerprep/schemas";
import { Button, LinkButton } from "@peerprep/ui/button";
import { useAuth, useUpdateUser } from "@peerprep/utils/client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfileSettingPage() {
  const { data: user } = useAuth();
  
  if (!user || !user.id) throw new Error("invariant: user or user.id is undefined");

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState("");
  const { isMutating, trigger: updateUser } = useUpdateUser(user.id);

  const updatedData: UpdateUser= { username, email};
  if (password) updatedData.password = password;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Profile Information</h2>

      <form
        className="flex flex-col gap-4"
        onSubmit={async e => {
          e.preventDefault();
          await updateUser(updatedData);
          toast.success("Profile updated successfully!");
        }}
      >
        <div className="profile-image mb-4">
          <img
            src={user.imageUrl}
            alt={`${user.username}'s profile`}
            className="rounded-full w-24 h-24 object-cover"
          />
        </div>

        <label className="text-lg font-semibold">
          Username
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded w-full mt-2"
            required
          />
        </label>

        <label className="text-lg font-semibold">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded w-full mt-2"
            required
          />
        </label>

        <label className="text-lg font-semibold">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded w-full mt-2"
            placeholder="Leave blank to keep current password"
          />
        </label>

        <div className="flex gap-4">
          <Button type="submit" variants={{ variant: "primary" }} disabled={isMutating}>
            {isMutating ? "Updating..." : "Update Profile"}
          </Button>
          <LinkButton href=".." className="w-auto">
            Back
          </LinkButton>
        </div>
      </form>
    </div>
  );
}
