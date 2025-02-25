import React, { useState } from 'react';


function PostForm({ onAddPost }) {
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new post object
    const newPost = {
      title,
      content,
      author: 'Anonymous', // You can modify this to use the logged-in user
      timestamp: new Date().toLocaleString(),
    };

    // Pass the new post to the parent component via onAddPost
    onAddPost(newPost);

    // Reset the form fields
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
      <div className="form-group">
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your Questions or a post"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          required
        />
      </div>

      <button type="submit" className="submit-button">Post</button>
    </form>
  );
}

export default PostForm;
