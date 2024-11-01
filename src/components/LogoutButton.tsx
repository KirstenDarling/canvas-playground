import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded-md text-sm"
    >
      Log Out
    </button>
  );
};

export default LogoutButton;
