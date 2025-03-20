import React from 'react';
import { Routes, Route } from "react-router-dom"; // Remove BrowserRouter
import Tabs from "./components/common/Tabs";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

function App() {
  return (
    <div className="min-h-screen">
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Tabs />
            </>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;
