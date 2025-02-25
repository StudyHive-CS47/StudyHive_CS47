import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGroup } from '../../contexts/GroupContext'
import { api } from '../../services/api'
import { Button } from '../common/Button'

const GroupList = () => {
  const navigate = useNavigate()
  const { groups, setGroups } = useGroup()

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

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Groups</h1>
        <div className="space-x-4">
          <Button onClick={() => navigate('/explore')}>
            Explore Groups
          </Button>
          <Button onClick={() => navigate('/create')}>
            Create Group
          </Button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {groups && groups.length > 0 ? (
          groups.map((group) => (
            <div 
              key={group.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/group/${group.id}`)}
            >
              <h3 className="font-semibold text-lg mb-2">{group.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{group.university}</p>
              <p className="text-sm text-gray-600 mb-2">{group.module}</p>
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {group.memberEmails?.length || 0} members
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8 text-gray-500">
            No groups found. Create or join a group to get started!
          </div>
        )}
      </div>
    </div>
  )
}

export default GroupList