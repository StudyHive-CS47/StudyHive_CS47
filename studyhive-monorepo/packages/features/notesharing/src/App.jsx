import React from 'react';
import { Routes, Route } from "react-router-dom"; // Remove BrowserRouter
import Tabs from "./components/common/Tabs";
import Footer from '@shared/components/Footer/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';

function App() {
  return (
    <div className="min-h-screen d-flex flex-column">
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={
            <>
              <Tabs />
            </>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
