import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContentArea } from './ContentArea';
import type { PageContent } from '../types';

describe('ContentArea', () => {
  it('renders content lines correctly', () => {
    const content: PageContent = {
      lines: ['Line 1', 'Line 2', 'Line 3'],
    };

    render(<ContentArea content={content} />);
    
    const contentArea = screen.getByTestId('teletext-content-area');
    expect(contentArea).toBeDefined();
    expect(contentArea.textContent).toContain('Line 1');
    expect(contentArea.textContent).toContain('Line 2');
    expect(contentArea.textContent).toContain('Line 3');
  });

  it('truncates lines exceeding 40 characters', () => {
    const longLine = 'A'.repeat(50); // 50 characters
    const content: PageContent = {
      lines: [longLine],
    };

    render(<ContentArea content={content} />);
    
    const contentArea = screen.getByTestId('teletext-content-area');
    const renderedLine = contentArea.querySelector('.content-line');
    expect(renderedLine?.textContent?.length).toBe(40);
  });

  it('truncates content exceeding 23 rows', () => {
    const lines = Array.from({ length: 30 }, (_, i) => `Line ${i + 1}`);
    const content: PageContent = {
      lines,
    };

    render(<ContentArea content={content} />);
    
    const contentArea = screen.getByTestId('teletext-content-area');
    const renderedLines = contentArea.querySelectorAll('.content-line');
    expect(renderedLines.length).toBe(23);
  });

  it('applies color styling when ColorMap is provided', () => {
    const content: PageContent = {
      lines: ['HELLO'],
      colors: {
        2: { // Grid row 2 (first content row)
          0: 'red',
          1: 'green',
        },
      },
    };

    render(<ContentArea content={content} />);
    
    const contentArea = screen.getByTestId('teletext-content-area');
    const spans = contentArea.querySelectorAll('span');
    
    // First character should be red
    expect(spans[0].style.color).toBe('rgb(255, 0, 0)'); // #FF0000
    // Second character should be green
    expect(spans[1].style.color).toBe('rgb(0, 255, 0)'); // #00FF00
  });

  it('renders empty content without errors', () => {
    const content: PageContent = {
      lines: [],
    };

    render(<ContentArea content={content} />);
    
    const contentArea = screen.getByTestId('teletext-content-area');
    expect(contentArea).toBeDefined();
    const renderedLines = contentArea.querySelectorAll('.content-line');
    expect(renderedLines.length).toBe(0);
  });

  it('handles content with special characters', () => {
    const content: PageContent = {
      lines: ['Special: @#$%^&*()'],
    };

    render(<ContentArea content={content} />);
    
    const contentArea = screen.getByTestId('teletext-content-area');
    expect(contentArea.textContent).toContain('Special: @#$%^&*()');
  });
});
