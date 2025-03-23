const { render, screen } = require('@testing-library/react');
const { BrowserRouter } = require('react-router-dom');
const { AuthProvider } = require('@shared/contexts/AuthContext');
const App = require('../App').default;

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByTestId('app-container')).toBeInTheDocument();
  });
}); 