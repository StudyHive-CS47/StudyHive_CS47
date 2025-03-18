import React from 'react';
import { Routes, Route } from "react-router-dom"; // Remove BrowserRouter
import BrowsePage from "./pages/BrowsePage";
import Tabs from "./components/common/Tabs";

function App() {
  return (
    <div className="min-h-screen">
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Tabs />
              <BrowsePage />
            </>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
