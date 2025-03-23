const React = require('react');
const { render, screen } = require('@testing-library/react');

describe('Basic Component Test', () => {
  test('renders welcome message', () => {
    render(<div>Welcome to StudyHive</div>);
    const element = screen.getByText('Welcome to StudyHive');
    expect(element).toBeInTheDocument();
  });

  test('renders button', () => {
    render(<button>Click me</button>);
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
  });
});
