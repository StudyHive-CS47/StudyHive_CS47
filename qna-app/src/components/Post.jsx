import React from 'react';
import PostActions from './PostActions';

const Post = ({ post }) => (
  <div className="post">
    <div className="post-header">
      <h2>{post.title}</h2>
      <p>{post.author}</p>
    </div>
    <p>{post.content}</p>
    <img src={post.image} alt={post.title} className="post-image" />
    <PostActions />
  </div>
);

export default Post;
