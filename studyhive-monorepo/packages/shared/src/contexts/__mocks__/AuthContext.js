const React = require('react');

const useAuth = jest.fn().mockReturnValue({
  user: null,
  login: jest.fn(),
  logout: jest.fn(),
  signup: jest.fn()
});

const AuthProvider = ({ children }) => children;

module.exports = {
  useAuth,
  AuthProvider
}; 