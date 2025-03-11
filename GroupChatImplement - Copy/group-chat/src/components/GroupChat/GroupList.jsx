import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGroup } from '../../contexts/GroupContext'
import { api } from '../../services/api'
import Button from '../common/Button'
import SearchBar from '../common/SearchBar'

const GroupList = ({ onGroupSelect }) => {
  const navigate = useNavigate()
  const { groups, setGroups } = useGroup()
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchGroups()
  }, [])

  const fetchGroups = async () => {
    try {
      const response = await api.getMyGroups()
      setGroups(response.data || [])
    } catch (error) {
      console.error('Error fetching groups:', error)
      setGroups([])
    }
  }

  const handleSearch = (term) => {
    setSearchTerm(term)
    // Implement search logic here
  }

  const getGroupAvatar = (name) => {
    return name.charAt(0).toUpperCase()
  }

  const renderMemberAvatars = (members) => {
    const maxDisplay = 3
    const remaining = members.length - maxDisplay

    return (
      <div className="flex -space-x-2">
        {members.slice(0, maxDisplay).map((member, idx) => (
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

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">My Groups</h1>
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="space-y-4">
        {groups.map((group) => (
          <div 
            key={group.id}
            onClick={() => onGroupSelect(group)}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-semibold">
                {getGroupAvatar(group.name)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{group.name}</h3>
                <p className="text-sm text-gray-600">{group.university}</p>
              </div>
              {renderMemberAvatars(group.memberEmails || [])}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GroupList