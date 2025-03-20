import React from 'react'

const MembersList = ({ members = [], adminEmail }) => {
  if (!members || members.length === 0) {
    return (
      <div className="text-center py-4">
        <div className="text-gray-500 text-sm">No members found</div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {members.filter(email => email).map((memberEmail) => (
        <div 
          key={memberEmail}
          className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
            <span className="text-blue-500 font-semibold text-lg">
              {memberEmail && memberEmail[0] ? memberEmail[0].toUpperCase() : '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline">
              <p className="text-sm font-medium text-gray-900 truncate">
                {memberEmail.split('@')[0]}
              </p>
              {memberEmail === adminEmail && (
                <span className="ml-2 px-1.5 py-0.5 text-[0.65rem] font-medium bg-blue-100 text-blue-600 rounded">
                  Admin
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 truncate">
              {memberEmail}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MembersList;