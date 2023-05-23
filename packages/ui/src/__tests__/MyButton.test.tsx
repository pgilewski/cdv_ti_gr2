import { render, screen, fireEvent } from '@testing-library/react';

import { MyButton } from '../index';

describe('<MyButton />', () => {
  it('renders component correctly', () => {
    // When
    render(<MyButton>My button</MyButton>);
    const button = screen.queryByText('My button');

    // Then
    expect(button).toBeInTheDocument();
  });

  it('clicks', () => {
    // When
    const onClick = jest.fn();
    render(<MyButton onClick={onClick}>My button</MyButton>);
    const button = screen.getByText('My button');

    // Then
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
