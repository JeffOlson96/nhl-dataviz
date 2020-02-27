import React from 'react';
import { render } from '@testing-library/react';
import BaseApp from './BaseApp';

test('renders learn react link', () => {
  const { getByText } = render(<BaseApp />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
