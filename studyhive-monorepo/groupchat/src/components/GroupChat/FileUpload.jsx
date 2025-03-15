import React from 'react'
import { fileApi } from '../../services/supabase'

const FileUpload = ({ onUpload }) => {
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        await onUpload(file)
        e.target.value = '' // Reset input after successful upload
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    }
  }

  return (
    <div className="p-4">
      <label className="block text-sm font-medium text-gray-700">Upload File</label>
      <input
        type="file"
        onChange={handleFileChange}
        className="mt-1 block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
    </div>
  )
}

export default FileUpload