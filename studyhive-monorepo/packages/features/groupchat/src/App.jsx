import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MyGroups from './components/Groups/MyGroups'
import ExploreGroups from './components/Groups/ExploreGroups'
import CreateGroup from './components/Groups/CreateGroup'
import { GroupProvider } from './contexts/GroupContext'
import Footer from '@shared/components/Footer/Footer'
import './App.css'

const App = () => {
  return (
    <GroupProvider>
      <div className="flex flex-col min-h-screen w-full bg-[#EEF4FE] overflow-x-hidden">
        <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 mt-4">
          <Routes>
            <Route path="/" element={<MyGroups />} />
            <Route path="/my-groups" element={<MyGroups />} />
            <Route path="/explore" element={<ExploreGroups />} />
            <Route path="/create" element={<CreateGroup />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </GroupProvider>
  );
};

export default App;