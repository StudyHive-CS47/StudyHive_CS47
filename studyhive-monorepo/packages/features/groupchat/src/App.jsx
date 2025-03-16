import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { GroupProvider } from './contexts/GroupContext'
import CreateGroup from './components/Groups/CreateGroup'
import ExploreGroups from './components/Groups/ExploreGroups'
import GroupLayout from './components/GroupChat/GroupLayout'
import PageLayout from './components/common/PageLayout'
import LoginPage from './components/Auth/LoginPage'
import SignupPage from './components/Auth/SignupPage'
import { useAuth } from './contexts/AuthContext'
import MyGroups from './components/Groups/MyGroups'
import GroupChat from './components/GroupChat/GroupChat'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div>Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" />
  }

  return <GroupProvider>{children}</GroupProvider>
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <PageLayout>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              
              {/* Protected Routes */}
              <Route path="/" element={<Navigate to="/my-groups" />} />
              <Route path="/my-groups" element={
                <ProtectedRoute>
                  <MyGroups />
                </ProtectedRoute>
              } />
              <Route path="/explore" element={
                <ProtectedRoute>
                  <ExploreGroups />
                </ProtectedRoute>
              } />
              <Route path="/create" element={
                <ProtectedRoute>
                  <CreateGroup />
                </ProtectedRoute>
              } />
              <Route path="/chat/:groupId" element={
                <ProtectedRoute>
                  <GroupChat />
                </ProtectedRoute>
              } />
            </Routes>
          </PageLayout>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;