import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { GroupProvider } from './contexts/GroupContext'
import CreateGroup from './components/Groups/CreateGroup'
import ExploreGroups from './components/Groups/ExploreGroups'
import MyGroups from './components/Groups/MyGroups'
import GroupChat from './components/GroupChat/GroupChat'
import PageLayout from './components/common/PageLayout'
import './App.css'

function App() {
  return (
    <GroupProvider>
      <div className="min-h-screen bg-gray-50">
        <PageLayout>
          <Routes>
            <Route path="/" element={<Navigate to="my-groups" />} />
            <Route path="my-groups" element={<MyGroups />} />
            <Route path="explore" element={<ExploreGroups />} />
            <Route path="create" element={<CreateGroup />} />
            <Route path="chat/:groupId" element={<GroupChat />} />
          </Routes>
        </PageLayout>
      </div>
    </GroupProvider>
  );
}

export default App;