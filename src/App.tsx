import React, { useState } from "react";
import Profile from "./components/Profile";
import Canvas from "./components/Canvas";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  const [showProfile, setShowProfile] = useState(true);

  return (
    <BrowserRouter>
      <div className="flex flex-col m-5 justify-center">
        {showProfile && <Profile />}
        <Routes>
          <Route
            path="/Canvas"
            element={
              <Canvas onFullscreenToggle={() => setShowProfile(!showProfile)} />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
