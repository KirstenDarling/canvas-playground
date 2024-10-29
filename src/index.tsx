import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const redirect_uri =
  window.location.hostname === "localhost"
    ? "http://localhost:3000/canvas"
    : "https://canvas-playground-pi.vercel.app/canvas";

root.render(
  <Auth0Provider
    domain="dev-03envwj7xqhyfpzs.us.auth0.com"
    clientId="EDNw16nunBDPe0yuKg9ZuaSSw1iOYef9"
    authorizationParams={{
      redirect_uri: redirect_uri,
    }}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Auth0Provider>
);

reportWebVitals();
