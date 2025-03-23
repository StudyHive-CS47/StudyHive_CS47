const React = require('react');
const { render, screen } = require('@testing-library/react');

describe('Verify Setup', () => {
  test('basic render works', () => {
    render(React.createElement('div', null, 'Test Setup'));
    expect(screen.getByText('Test Setup')).toBeInTheDocument();
  });
}); 