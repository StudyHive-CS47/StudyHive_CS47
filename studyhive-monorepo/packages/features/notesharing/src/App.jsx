import React from 'react';
import { Routes, Route } from "react-router-dom";
import Tabs from "./components/common/Tabs";
import BrowsePage from "./pages/BrowsePage";
import UploadPage from "./pages/UploadPage";
import MyNotesPage from "./pages/MyNotesPage";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

function App() {
  return (
    <div className="min-h-screen">
      <main>
        <Tabs />
      </main>
    </div>
  );
}

export default App;
