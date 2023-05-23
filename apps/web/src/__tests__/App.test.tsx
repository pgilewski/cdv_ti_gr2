import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// To Test
import App from '../App';

// Tests
describe('<App />', () => {
  /**
   * Resets all renders after each test
   */
  afterEach(() => {
    cleanup();
  });

  it('renders the page correctly', async () => {
    // When
    await render(<App />);
    const h1 = await screen.queryByText('Vite + React');

    // Then
    expect(h1).toBeInTheDocument();
  });

  it('shows the button count set to 0', async () => {
    // When
    await render(<App />);
    const button = await screen.queryByText('count is 0');

    // Then
    expect(button).toBeInTheDocument();
  });

  it('shows the button count set to 3', async () => {
    // When
    const user = userEvent.setup();
    await render(<App />);
    const button = await screen.queryByText('count is 0');

    // Then
    expect(button).toBeInTheDocument();

    // When
    await user.click(button as HTMLElement);
    await user.click(button as HTMLElement);
    await user.click(button as HTMLElement);

    // Then
    expect(button?.innerHTML).toBe('count is 3');
  });
});
