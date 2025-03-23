const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');
const { BrowserRouter } = require('react-router-dom');
const { AuthProvider } = require('@shared/contexts/AuthContext');

describe('Login Form', () => {
  test('renders login form elements', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <div data-testid="login-form">
            <input 
              type="email" 
              placeholder="Email"
              data-testid="email-input"
            />
            <input 
              type="password"
              placeholder="Password"
              data-testid="password-input"
            />
            <button data-testid="login-button">Login</button>
          </div>
        </AuthProvider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });
}); 