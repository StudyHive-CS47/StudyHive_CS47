import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CreateGroup from './components/Groups/CreateGroup'
import ExploreGroups from './components/GroupChat/ExploreGroups'
import GroupDetail from './components/GroupChat/GroupDetail'
import GroupList from './components/GroupChat/GroupList'
import MyGroups from './components/Groups/MyGroups'
import ChatRoom from './components/Chat/ChatRoom'
import NavBar from './components/common/NavBar'
import Header from './components/common/Header'
import Footer from './components/common/Footer'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="pt-16 pb-32"> {/* Add padding for header and footer */}
          <Routes>
            <Route path="/" element={<GroupList />} />
            <Route path="/create" element={<CreateGroup />} />
            <Route path="/explore" element={<ExploreGroups />} />
            <Route path="/group/:id" element={<GroupDetail />} />
            <Route path="/my-groups" element={<MyGroups />} />
            <Route path="/chat/:groupId" element={<ChatRoom />} />
          </Routes>
        </div>
        <NavBar />
        <Footer />
      </div>
    </Router>
  )
}

export default App