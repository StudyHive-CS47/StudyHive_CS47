const React = require('react');
const { render, screen } = require('@testing-library/react');

describe('Simple Math Test', () => {
  test('addition works', () => {
    expect(1 + 1).toBe(2);
  });

  test('subtraction works', () => {
    expect(5 - 3).toBe(2);
  });
}); 