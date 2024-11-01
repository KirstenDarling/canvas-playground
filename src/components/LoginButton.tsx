import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect()}
      className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-1 px-3 rounded-md text-sm"
    >
      Log In
    </button>
  );
};

export default LoginButton;
