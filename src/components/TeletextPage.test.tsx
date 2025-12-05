import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TeletextPage } from './TeletextPage';
import type { PageContent } from '../types';

// Mock the useClock hook to return a fixed time
vi.mock('../hooks/useClock', () => ({
  useClock: () => new Date('2024-01-15T14:30:45')
}));

describe('TeletextPage Component', () => {
  const mockPageContent: PageContent = {
    lines: [
      'Welcome to Teletext',
      '',
      'This is a test page',
      'Line 4',
      'Line 5'
    ]
  };

  it('renders with correct structure', () => {
    render(
      <TeletextPage 
        pageNumber={100} 
        pageContent={mockPageContent} 
      />
    );
    
    const page = screen.getByTestId('teletext-page');
    expect(page).toBeDefined();
  });

  it('integrates Header component', () => {
    render(
      <TeletextPage 
        pageNumber={100} 
        pageContent={mockPageContent} 
      />
    );
    
    const header = screen.getByTestId('teletext-header');
    expect(header).toBeDefined();
  });

  it('integrates ContentArea component', () => {
    render(
      <TeletextPage 
        pageNumber={100} 
        pageContent={mockPageContent} 
      />
    );
    
    const contentArea = screen.getByTestId('teletext-content-area');
    expect(contentArea).toBeDefined();
  });

  it('passes page number to Header', () => {
    render(
      <TeletextPage 
        pageNumber={300} 
        pageContent={mockPageContent} 
      />
    );
    
    const header = screen.getByTestId('teletext-header');
    expect(header.textContent).toContain('P300');
  });

  it('passes current time to Header from useClock', () => {
    render(
      <TeletextPage 
        pageNumber={100} 
        pageContent={mockPageContent} 
      />
    );
    
    const header = screen.getByTestId('teletext-header');
    expect(header.textContent).toContain('14:30:45');
  });

  it('uses default page name when not provided', () => {
    render(
      <TeletextPage 
        pageNumber={100} 
        pageContent={mockPageContent} 
      />
    );
    
    const header = screen.getByTestId('teletext-header');
    expect(header.textContent).toContain('TELETEXT ZERO');
  });

  it('uses custom page name when provided', () => {
    render(
      <TeletextPage 
        pageNumber={100} 
        pageContent={mockPageContent}
        pageName="CUSTOM NAME"
      />
    );
    
    const header = screen.getByTestId('teletext-header');
    expect(header.textContent).toContain('CUSTOM NAME');
  });

  it('passes page content to ContentArea', () => {
    render(
      <TeletextPage 
        pageNumber={100} 
        pageContent={mockPageContent} 
      />
    );
    
    const contentArea = screen.getByTestId('teletext-content-area');
    expect(contentArea.textContent).toContain('Welcome to Teletext');
    expect(contentArea.textContent).toContain('This is a test page');
  });

  it('renders with empty content', () => {
    const emptyContent: PageContent = {
      lines: []
    };
    
    render(
      <TeletextPage 
        pageNumber={100} 
        pageContent={emptyContent} 
      />
    );
    
    const page = screen.getByTestId('teletext-page');
    expect(page).toBeDefined();
    
    const header = screen.getByTestId('teletext-header');
    expect(header).toBeDefined();
    
    const contentArea = screen.getByTestId('teletext-content-area');
    expect(contentArea).toBeDefined();
  });

  it('renders with maximum content lines', () => {
    const maxContent: PageContent = {
      lines: Array(23).fill('Test line')
    };
    
    render(
      <TeletextPage 
        pageNumber={100} 
        pageContent={maxContent} 
      />
    );
    
    const contentArea = screen.getByTestId('teletext-content-area');
    const lines = contentArea.querySelectorAll('.content-line');
    expect(lines.length).toBe(23);
  });

  it('applies CSS Grid layout class', () => {
    render(
      <TeletextPage 
        pageNumber={100} 
        pageContent={mockPageContent} 
      />
    );
    
    const page = screen.getByTestId('teletext-page');
    expect(page.className).toContain('teletext-page');
  });

  it('renders different page numbers correctly', () => {
    const pageNumbers = [100, 200, 300, 999];
    
    pageNumbers.forEach(pageNumber => {
      const { unmount } = render(
        <TeletextPage 
          pageNumber={pageNumber} 
          pageContent={mockPageContent} 
        />
      );
      
      const header = screen.getByTestId('teletext-header');
      expect(header.textContent).toContain(`P${pageNumber.toString().padStart(3, '0')}`);
      
      unmount();
    });
  });

  it('handles content with color map', () => {
    const coloredContent: PageContent = {
      lines: ['Colored text'],
      colors: {
        2: {
          0: 'red',
          1: 'green'
        }
      }
    };
    
    render(
      <TeletextPage 
        pageNumber={100} 
        pageContent={coloredContent} 
      />
    );
    
    const contentArea = screen.getByTestId('teletext-content-area');
    expect(contentArea).toBeDefined();
    expect(contentArea.textContent).toContain('Colored text');
  });
});
