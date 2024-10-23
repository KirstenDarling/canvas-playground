import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import PlaceholderImage from "../assets/images/placeholder.jpg";

const Profile = () => {
  const { user, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      <div className="bg-gray-100 p-4 rounded-lg shadow-md">
        <div className="flex">
          <img
            src={user ? user.picture : PlaceholderImage}
            alt={user ? user.name : "placeholder image"}
            className="rounded-full h-20 w-20"
          />
          <div className="flex flex-col ml-4">
            <h2 className="text-xl font-semibold">
              {user ? user.name : "Hello"}
            </h2>
            <p className="text-gray-600">
              {user ? user.email : "Please login below:"}
            </p>
            <div className="flex">
              {user ? <LogoutButton /> : <LoginButton />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
