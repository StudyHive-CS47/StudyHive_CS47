import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../config/supabase'
import { useAuth } from '@shared/contexts/AuthContext'

const GroupContext = createContext()

export const useGroup = () => {
  const context = useContext(GroupContext)
  if (!context) {
    throw new Error('useGroup must be used within a GroupProvider')
  }
  return context
}

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState([])
  const [currentGroup, setCurrentGroup] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchGroups()
    }
  }, [user])

  const fetchGroups = async () => {
    try {
      setError(null)
      const { data, error } = await supabase
        .from('groups')
        .select(`
          *,
          group_members!inner(user_id)
        `)
        .eq('group_members.user_id', user.id)

      if (error) throw error

      // Add admin info from the current user if they're the admin
      const groupsWithAdmin = data.map(group => ({
        ...group,
        admin: group.admin_id === user.id ? { email: user.email } : { email: 'Group Admin' }
      }))

      setGroups(groupsWithAdmin || [])
    } catch (err) {
      console.error('Error fetching groups:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const createGroup = async ({ name, university, degree, module, description }) => {
    try {
      const { data, error } = await supabase
        .from('groups')
        .insert([
          {
            name,
            university,
            degree,
            module,
            description,
            admin_id: user.id,
          },
        ])
        .select()
        .single()

      if (error) throw error

      // Automatically add the creator as a member
      const { error: memberError } = await supabase
        .from('group_members')
        .insert([
          {
            group_id: data.id,
            user_id: user.id,
          },
        ])

      if (memberError) throw memberError

      // Refresh groups list
      await fetchGroups()
      return data
    } catch (error) {
      console.error('Error creating group:', error)
      setError(error.message)
      throw error
    }
  }

  const selectGroup = (group) => {
    setCurrentGroup(group)
  }

  const value = {
    groups,
    setGroups,
    currentGroup,
    setCurrentGroup,
    loading,
    error,
    createGroup,
    selectGroup,
    refreshGroups: fetchGroups
  }

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  )
}

export default GroupContext