const React = require('react');
require('@testing-library/jest-dom');

// Mock lazy-loaded components
jest.mock('@auth/pages/Login/LoginPage', () => () => React.createElement('div', null, 'Login Page'));
jest.mock('@auth/pages/Signup/SignupPage', () => () => React.createElement('div', null, 'Signup Page'));
jest.mock('@landing/App', () => () => React.createElement('div', null, 'Landing Page'));
jest.mock('@home/App', () => () => React.createElement('div', null, 'Home Page'));
jest.mock('@notesharing/App', () => () => React.createElement('div', null, 'Note Sharing'));
jest.mock('@qna/App', () => () => React.createElement('div', null, 'QnA'));
jest.mock('@groupchat/App', () => () => React.createElement('div', null, 'Group Chat'));
jest.mock('@summarizer/App', () => () => React.createElement('div', null, 'Summarizer'));
jest.mock('@quiz/App', () => () => React.createElement('div', null, 'Quiz'));
jest.mock('@chat_bot/App', () => () => React.createElement('div', null, 'Chat Bot'));
jest.mock('@userprofile/App', () => () => React.createElement('div', null, 'User Profile'));

// Mock supabase
jest.mock('@shared/config/supabase', () => ({
  supabase: {
    auth: {
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      onAuthStateChange: jest.fn()
    }
  }
}));