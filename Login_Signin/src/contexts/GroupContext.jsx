import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../config/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  addDoc, 
  doc, 
  updateDoc, 
  arrayUnion,
  serverTimestamp 
} from 'firebase/firestore';

const GroupContext = createContext();

export function GroupProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to groups collection
    const unsubscribe = onSnapshot(
      query(collection(db, 'groups'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const groupsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGroups(groupsData);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Function to create a new group
  const createGroup = async (groupData) => {
    try {
      const groupRef = await addDoc(collection(db, 'groups'), {
        ...groupData,
        createdAt: serverTimestamp(),
        members: [],
        isPrivate: false
      });
      return groupRef.id;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  };

  // Function to join a group
  const joinGroup = async (groupId, userId) => {
    try {
      const groupRef = doc(db, 'groups', groupId);
      await updateDoc(groupRef, {
        members: arrayUnion(userId)
      });
    } catch (error) {
      console.error('Error joining group:', error);
      throw error;
    }
  };

  return (
    <GroupContext.Provider value={{
      groups,
      userGroups,
      loading,
      createGroup,
      joinGroup
    }}>
      {children}
    </GroupContext.Provider>
  );
}

export const useGroups = () => useContext(GroupContext); 