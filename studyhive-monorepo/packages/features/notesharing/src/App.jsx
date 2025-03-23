import React from 'react';
import { Routes, Route } from "react-router-dom";
import Tabs from "./components/common/Tabs";
import BrowsePage from "./pages/BrowsePage";
import UploadPage from "./pages/UploadPage";
import MyNotesPage from "./pages/MyNotesPage";
import { Footer } from '@shared';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

function App() {
  return (
    <div className="min-h-screen d-flex flex-column">
      <main className="flex-grow-1">
        <Tabs />
      </main>
      <Footer />
    </div>
  );
}

export default App;
