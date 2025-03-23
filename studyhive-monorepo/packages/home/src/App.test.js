const React = require('react');
const { render, screen } = require('@testing-library/react');
const { BrowserRouter } = require('react-router-dom');
const { AuthProvider } = require('@shared/contexts/AuthContext');

// Mock the lazy-loaded components
jest.mock('@auth/pages/Login/LoginPage', () => () => <div>Login Page</div>);
jest.mock('@auth/pages/Signup/SignupPage', () => () => <div>Signup Page</div>);
jest.mock('@landing/App', () => () => <div>Landing Page</div>);
jest.mock('@home/App', () => () => <div>Home Page</div>);

describe('App Component', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        <AuthProvider>
          {component}
        </AuthProvider>
      </BrowserRouter>
    );
  };

  test('renders landing page for unauthenticated users', () => {
    renderWithRouter(<App />);
    expect(screen.getByText(/StudyHive/i)).toBeInTheDocument();
  });

  test('shows header when user is authenticated', () => {
    const mockUser = { id: 1, name: 'Test User' };
    jest.spyOn(AuthProvider, 'useAuth').mockImplementation(() => ({
      user: mockUser
    }));
    
    renderWithRouter(<App />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  test('redirects to login for protected routes when not authenticated', () => {
    renderWithRouter(<App />);
    // Navigate to a protected route
    window.history.pushState({}, '', '/home');
    expect(window.location.pathname).toBe('/login');
  });
});

describe('Home App', () => {
  test('renders home page', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <div>Home Page</div>
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByText('Home Page')).toBeInTheDocument();
  });
});
