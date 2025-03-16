import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGroup } from '../../contexts/GroupContext'
import { groupApi } from '../../services/supabase'
import SearchBar from '../common/SearchBar'

const GroupList = ({ onGroupSelect }) => {
  const navigate = useNavigate()
  const { groups, setGroups } = useGroup()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      setLoading(true)
      const response = await groupApi.getMyGroups()
      setGroups(response || [])
    } catch (error) {
      console.error('Error fetching groups:', error)
      setError('Failed to fetch groups')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    // Filter groups locally based on search term
    if (term.trim()) {
      const filtered = groups.filter(group => 
        group.name.toLowerCase().includes(term.toLowerCase()) ||
        group.university.toLowerCase().includes(term.toLowerCase())
      )
      setGroups(filtered)
    } else {
      fetchGroups() // Reset to all groups when search is cleared
    }
  }

  const getGroupAvatar = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?'
  }

  const renderMemberAvatars = (members = []) => {
    // Ensure members is an array and filter out null/undefined values
    const validMembers = members.filter(member => member)
    const maxDisplay = 3
    const remaining = Math.max(0, validMembers.length - maxDisplay)

    return (
      <div className="flex -space-x-2">
        {validMembers.slice(0, maxDisplay).map((member, idx) => (
          <div key={idx} className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-sm border-2 border-white">
            {member.charAt(0).toUpperCase()}
          </div>
        ))}
        {remaining > 0 && (
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm border-2 border-white">
            +{remaining}
          </div>
        )}
      </div>
    )
  }

  if (loading) {
    return <div className="p-4 text-center">Loading groups...</div>
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold mb-4">My Groups</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {groups.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            No groups found. Join or create a group to get started!
          </div>
        ) : (
          <div className="space-y-3">
            {groups.map((group) => (
              <div 
                key={group.id}
                onClick={() => onGroupSelect(group)}
                className="bg-white rounded-lg p-4 border hover:border-blue-500 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold shrink-0">
                    {getGroupAvatar(group.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{group.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{group.university}</p>
                    <p className="text-xs text-gray-500">
                      {group.admin_id === user?.id ? 
                        <span className="text-green-600">Admin</span> : 
                        <span className="text-blue-600">Member</span>
                      }
                    </p>
                  </div>
                  {renderMemberAvatars(group.memberEmails || [])}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupList