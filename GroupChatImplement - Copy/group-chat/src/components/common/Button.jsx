import React from 'react'

export const Button = ({ children, className = '', ...props }) => {
  return (
    <button
      className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 
        transition-colors duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}