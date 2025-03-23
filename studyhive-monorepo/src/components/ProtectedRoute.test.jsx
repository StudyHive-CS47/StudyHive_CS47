const { render, screen } = require('@testing-library/react');
const { BrowserRouter } = require('react-router-dom');
const { AuthProvider } = require('@shared/contexts/AuthContext');
const ProtectedRoute = require('./ProtectedRoute').default;

describe('ProtectedRoute', () => {
  test('renders children when authenticated', () => {
    const useAuth = jest.requireMock('@shared/contexts/AuthContext').useAuth;
    useAuth.mockReturnValue({ user: { id: '123' } });

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
}); 