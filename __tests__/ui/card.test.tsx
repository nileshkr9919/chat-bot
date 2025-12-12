import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from '@/components/ui/Card';

describe('Card UI', () => {
  it('renders children and applies card classes', () => {
    render(<Card><div>Inside</div></Card>);
    const el = screen.getByText('Inside');
    expect(el).toBeTruthy();
    // the Card renders a wrapper div; move up from inner node to find it
    const inner = el.closest('div');
    const wrapper = inner?.parentElement;
    expect(wrapper).toBeTruthy();
    // expects the Card wrapper to include card-shadow class
    expect(wrapper?.className).toContain('card-shadow');
  });
});
