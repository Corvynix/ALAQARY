import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

function TestComponent() {
  return <div>Hello Test</div>;
}

describe('Example Test Suite', () => {
  it('should render component', () => {
    render(<TestComponent />);
    expect(screen.getByText('Hello Test')).toBeInTheDocument();
  });

  it('basic math operations work', () => {
    expect(1 + 1).toBe(2);
    expect(10 - 5).toBe(5);
  });
});
