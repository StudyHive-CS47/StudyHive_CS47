import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setUser({
          uid: user.uid,
          email: user.email,
          ...userDoc.data()
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, userData) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      createdAt: new Date()
    });
  };

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const { user } = await signInWithPopup(auth, provider);
    
    // Create/update user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
      role: 'student'
    }, { merge: true });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signup,
      login,
      logout,
      signInWithGoogle
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 