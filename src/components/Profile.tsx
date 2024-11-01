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
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
        <div className="flex items-center">
          <img
            src={user ? user.picture : PlaceholderImage}
            alt={user ? user.name : "placeholder image"}
            className="rounded-full h-16 w-16 border border-gray-300"
          />
          <div className="ml-4">
            <h2 className="text-lg font-medium text-gray-800">
              {user ? user.name : "Hello"}
            </h2>
            <p className="text-sm text-gray-600">
              {user ? user.email : "Please login below:"}
            </p>
            <div className="mt-2">
              {" "}
              {/* Add mt-2 back here */}
              {user ? <LogoutButton /> : <LoginButton />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
