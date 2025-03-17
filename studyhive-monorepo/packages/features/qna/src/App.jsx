import React from 'react';
import { Routes, Route } from "react-router-dom";
import QnA from "./pages/QnA";
import Header from "@shared/components/Header/Header";
import Footer from "@shared/components/Footer/Footer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<QnA />} />
      <Route path="/qna" element={<QnA />} />
    </Routes>
  );
}

export default App;

