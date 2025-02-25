import React from 'react'

const MembersList = ({ members, memberCount }) => {
  return (
    <div className="p-4">
      <h3 className="font-semibold mb-4">Members ({memberCount})</h3>
      <div className="space-y-2">
        {members.map((member) => (
          <div key={member.id} className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              {member.name[0].toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium">{member.name}</p>
              <p className="text-xs text-gray-500">{member.email}</p>
            </div>
            {member.isAdmin && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Admin
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MembersList