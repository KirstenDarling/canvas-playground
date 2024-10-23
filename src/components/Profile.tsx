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
        <div className="bg-gray-100 p-4 rounded-lg shadow-md">
          <div className="flex">
            <img
              src={user.picture}
              alt={user.name}
              className="rounded-full h-20 w-20"
            />
            <div className="flex flex-col ml-4">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
