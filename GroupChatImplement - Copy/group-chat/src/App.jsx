import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CreateGroup from './components/Groups/CreateGroup'
import ExploreGroups from './components/GroupChat/ExploreGroups'
import GroupDetail from './components/GroupChat/GroupDetail'
import GroupList from './components/GroupChat/GroupList'
import MyGroups from './components/Groups/MyGroups'
import ChatRoom from './components/Chat/ChatRoom'
import NavBar from './components/common/NavBar'
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import GroupLayout from './components/GroupChat/GroupLayout'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="pt-16 pb-32"> {/* Add padding for header and footer */}
          <Routes>
            <Route path="/" element={<Navigate to="/my-groups" replace />} />
            <Route path="/my-groups" element={<MyGroups />} />
            <Route path="/group/:id" element={<GroupDetail />} />
            <Route path="/chat/:groupId" element={<ChatRoom />} />
            <Route path="/explore" element={<ExploreGroups />} />
            <Route path="/create" element={<CreateGroup />} />
          </Routes>
        </div>
        <NavBar />
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App