import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!isAuthenticated) {
    return null; // Or you can return a message like "You are not logged in."
  }

  return (
    <div>
      {user && (
        <div className="flex">
          <img src={user.picture} alt={user.name} className="rounded-full" />
          <div className="flex flex-col ml-3 pt-[7%]">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
