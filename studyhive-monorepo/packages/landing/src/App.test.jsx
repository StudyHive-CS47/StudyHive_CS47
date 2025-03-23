const { render, screen, fireEvent } = require('@testing-library/react');
const { BrowserRouter } = require('react-router-dom');
const App = require('./App').default;

describe('Landing Page', () => {
  const renderWithRouter = (component) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  test('renders hero section with main heading', () => {
    renderWithRouter(<App />);
    expect(screen.getByText(/Welcome to StudyHive/i)).toBeInTheDocument();
  });

  test('displays all feature cards', () => {
    renderWithRouter(<App />);
    expect(screen.getByText('Seamless Note Sharing')).toBeInTheDocument();
    expect(screen.getByText('Group Chat for Study Sessions')).toBeInTheDocument();
    expect(screen.getByText('Interactive Q&A Board')).toBeInTheDocument();
  });

  test('team member cards have correct LinkedIn links', () => {
    renderWithRouter(<App />);
    const linkedInLinks = screen.getAllByRole('link', { name: /linkedin/i });
    expect(linkedInLinks).toHaveLength(6); // Number of team members
  });
}); 