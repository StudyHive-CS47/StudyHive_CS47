import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

describe('Header Component', () => {
  beforeEach(() => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  });

  test('renders logo and title', () => {
    expect(screen.getByAltText('StudyHive')).toBeInTheDocument();
    expect(screen.getByText('StudyHive')).toBeInTheDocument();
  });

  test('renders all navigation links', () => {
    const navLinks = [
      'Home',
      'Note Sharing & Search',
      'ChatBot',
      'Q & A',
      'Group chat',
      'Summarize AI',
      'Quiz'
    ];

    navLinks.forEach(link => {
      expect(screen.getByText(link)).toBeInTheDocument();
    });
  });

  test('search and profile buttons are present', () => {
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /profile/i })).toBeInTheDocument();
  });
}); 