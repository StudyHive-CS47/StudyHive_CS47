import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CreateGroup from './components/Groups/CreateGroup'
import ExploreGroups from './components/GroupChat/ExploreGroups'
import GroupLayout from './components/GroupChat/GroupLayout'
import NavBar from './components/common/NavBar'
import Header from './components/common/Header'
import Footer from './components/common/Footer'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex">
          <NavBar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/my-groups" replace />} />
              <Route path="/my-groups" element={<GroupLayout />} />
              <Route path="/explore" element={<ExploreGroups />} />
              <Route path="/create" element={<CreateGroup />} />
            </Routes>
          </div>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;