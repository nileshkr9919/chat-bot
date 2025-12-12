import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Button from '@/components/ui/Button';

describe('Button UI', () => {
  it('renders children and has base classes', () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeTruthy();
    expect(btn).toHaveTextContent('Click me');
    expect(btn.className).toContain('inline-flex');
    expect(btn.className).toContain('bg-accent');
  });
});
