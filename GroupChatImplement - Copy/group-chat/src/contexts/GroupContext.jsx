import React, { createContext, useContext, useState } from 'react'

const GroupContext = createContext()

export function GroupProvider({ children }) {
  const [groups, setGroups] = useState([])
  const [currentGroup, setCurrentGroup] = useState(null)

  const value = {
    groups,
    setGroups,
    currentGroup,
    setCurrentGroup
  }

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  )
}

export function useGroup() {
  return useContext(GroupContext)
}