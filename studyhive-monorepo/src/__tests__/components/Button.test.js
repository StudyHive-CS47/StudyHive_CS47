const React = require('react');
const { render, screen, fireEvent } = require('@testing-library/react');

describe('Button Component', () => {
  test('renders button and handles click', () => {
    const handleClick = jest.fn();
    render(
      <button onClick={handleClick} data-testid="test-button">
        Click Me
      </button>
    );
    
    const button = screen.getByTestId('test-button');
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
}); 