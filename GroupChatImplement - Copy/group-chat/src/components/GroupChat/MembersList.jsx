import React from 'react'

const MembersList = ({ members = [], adminEmail }) => {
  if (!members || members.length === 0) {
    return <div className="text-gray-500">No members found</div>;
  }

  return (
    <div className="space-y-2">
      {members.filter(email => email).map((memberEmail) => (
        <div 
          key={memberEmail}
          className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm"
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              {memberEmail && memberEmail[0] ? memberEmail[0].toUpperCase() : '?'}
            </div>
            <div>
              <p className="text-sm font-medium">{memberEmail}</p>
              {memberEmail === adminEmail && (
                <span className="text-xs text-blue-500">Admin</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MembersList;