import React from "react";
import LoginButton from "./components/LoginButton";
import LogoutButton from "./components/LogoutButton";
import Profile from "./components/Profile";
import Canvas from "./components/Canvas";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col m-5 justify-center">
        <LoginButton />
        <LogoutButton />
        <Profile />
        <Routes>
          <Route path="/Canvas" element={<Canvas />} />{" "}
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
