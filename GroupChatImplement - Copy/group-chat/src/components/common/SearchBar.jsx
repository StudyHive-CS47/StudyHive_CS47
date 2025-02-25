import React from 'react'

export const SearchBar = ({ placeholder, onSearch }) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none 
          focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}