import { Button, LinkButton } from "@peerprep/ui/button";
import { useAuth } from "@peerprep/utils/client"

export default function ProfileSettingPage() {
    const { data: user } = useAuth();
    if (!user) {
        return null;
    }

    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Profile Information</h2>
  
        <div className="profile-image mb-4">
          <img
            src={user.imageUrl}
            alt={`${user.username}'s profile`}
            className="rounded-full w-24 h-24 object-cover"
          />
        </div>
  
        <div>
          <p className="text-lg font-semibold">Username: {user.username}</p>
          <p className="text-lg font-semibold">Email: {user.email}</p>
        </div>
  
        <Button variants={{ variant: "secondary" }}>
          Change Password
        </Button>

        <LinkButton href=".." className="w-auto">
        Back
        </LinkButton>
      </div>
    )
}