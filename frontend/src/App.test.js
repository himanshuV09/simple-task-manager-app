import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the Task Manager heading', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /task manager/i });
  expect(heading).toBeInTheDocument();
});
