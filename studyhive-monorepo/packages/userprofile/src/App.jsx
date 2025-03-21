import React from 'react';
import UserProfilePage from './pages/UserProfile/UserProfilePage';
import { useAuth } from '@shared/contexts/AuthContext';

function App() {
  const { user } = useAuth();
  
  if (!user) {
    return null;
  }
  
  return <UserProfilePage />;
}

export default App; 