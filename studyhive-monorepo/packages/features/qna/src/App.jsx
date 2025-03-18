import React from 'react';
import { Routes, Route } from "react-router-dom";
import QnA from "./pages/QnA";

function App() {
  return (
    <Routes>
      <Route path="/" element={<QnA />} />
    </Routes>
  );
}

export default App;

