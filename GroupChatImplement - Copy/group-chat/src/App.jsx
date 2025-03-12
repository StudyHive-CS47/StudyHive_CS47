import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CreateGroup from './components/Groups/CreateGroup'
import ExploreGroups from './components/GroupChat/ExploreGroups'
import GroupLayout from './components/GroupChat/GroupLayout'
import PageLayout from './components/common/PageLayout'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <PageLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/my-groups" replace />} />
            <Route path="/my-groups" element={<GroupLayout />} />
            <Route path="/explore" element={<ExploreGroups />} />
            <Route path="/create" element={<CreateGroup />} />
          </Routes>
        </PageLayout>
      </div>
    </BrowserRouter>
  );
}

export default App;