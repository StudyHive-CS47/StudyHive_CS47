import React, { useState } from 'react';
import Sidebar from '../components/Sidebar.jsx';
import Post from '../components/Post';
import PostForm from '../components/PostForm';
import '../styles.css';

const Home = () => {
  const [posts, setPosts] = useState([
    { title: 'Robotics Principles', content: 'What is the difference between forward kinematics...', author: 'Sally White', image: 'https://t3.ftcdn.net/jpg/00/60/46/76/360_F_60467600_edVkJvDs6Zl0HMo6x6IdZoO5Qv3WZQ64.jpg' }
  ]);

  const [popularQuestions, setPopularQuestions] = useState([
    'What is the difference between forward and inverse kinematics in robotics?',
    'How do I learn machine learning?',
    'What is a neural network?'
  ]);

  return (
    <div className="home">
      <div className="content">
        <div className="sidebar-section">
          <Sidebar popularQuestions={popularQuestions} />
        </div>
        <div className="posts-section">
          <PostForm />
          {posts.map((post, index) => (
            <Post key={index} post={post} />
          ))}
        </div>
        </div>
    </div>
  );
};

export default Home;
