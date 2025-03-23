const { render, screen } = require('@testing-library/react');
const { BrowserRouter } = require('react-router-dom');
const { AuthProvider } = require('@shared/contexts/AuthContext');

describe('Test Setup', () => {
  test('basic test setup works', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <div>Test Setup Works</div>
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByText('Test Setup Works')).toBeInTheDocument();
  });
}); 