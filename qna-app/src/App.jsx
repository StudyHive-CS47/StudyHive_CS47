import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QnA from "./pages/QnA";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/qna" element={<QnA />} />
        {/* Add routes for your other pages */}
        <Route path="/" element={<QnA />} /> {/* Default to QnA for this example */}
      </Routes>
    </Router>
  )
}
export default App;

