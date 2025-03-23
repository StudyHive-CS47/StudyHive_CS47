const React = require('react');
const { render, screen } = require('@testing-library/react');
const { BrowserRouter } = require('react-router-dom');

describe('Header Component', () => {
  test('renders navigation links', () => {
    render(
      <BrowserRouter>
        <nav>
          <a href="/home">Home</a>
          <a href="/notes">Note Sharing</a>
          <a href="/chat">Chat Bot</a>
          <a href="/qna">Q & A</a>
        </nav>
      </BrowserRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Note Sharing')).toBeInTheDocument();
    expect(screen.getByText('Chat Bot')).toBeInTheDocument();
    expect(screen.getByText('Q & A')).toBeInTheDocument();
  });
});
