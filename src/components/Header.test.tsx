import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from './Header';
import { GRID } from '../constants';

describe('Header Component', () => {
  it('renders with correct structure', () => {
    const testDate = new Date('2024-01-15T14:30:45');
    render(
      <Header 
        pageName="TELETEXT ZERO" 
        pageNumber={100} 
        currentTime={testDate} 
      />
    );
    
    const header = screen.getByTestId('teletext-header');
    expect(header).toBeDefined();
  });

  it('formats page number correctly', () => {
    const testDate = new Date('2024-01-15T14:30:45');
    render(
      <Header 
        pageName="TELETEXT ZERO" 
        pageNumber={100} 
        currentTime={testDate} 
      />
    );
    
    const header = screen.getByTestId('teletext-header');
    expect(header.textContent).toContain('P100');
  });

  it('formats page number with leading zeros', () => {
    const testDate = new Date('2024-01-15T14:30:45');
    render(
      <Header 
        pageName="TELETEXT ZERO" 
        pageNumber={5} 
        currentTime={testDate} 
      />
    );
    
    const header = screen.getByTestId('teletext-header');
    expect(header.textContent).toContain('P005');
  });

  it('formats time correctly', () => {
    const testDate = new Date('2024-01-15T14:30:45');
    render(
      <Header 
        pageName="TELETEXT ZERO" 
        pageNumber={100} 
        currentTime={testDate} 
      />
    );
    
    const header = screen.getByTestId('teletext-header');
    expect(header.textContent).toContain('14:30:45');
  });

  it('ensures exactly 40 characters width', () => {
    const testDate = new Date('2024-01-15T14:30:45');
    render(
      <Header 
        pageName="TELETEXT ZERO" 
        pageNumber={100} 
        currentTime={testDate} 
      />
    );
    
    const header = screen.getByTestId('teletext-header');
    const headerText = header.textContent || '';
    expect(headerText.length).toBe(GRID.COLUMNS);
  });

  it('maintains 40 character width with different page numbers', () => {
    const testDate = new Date('2024-01-15T14:30:45');
    
    const pageNumbers = [100, 200, 300, 999, 1];
    
    pageNumbers.forEach(pageNumber => {
      const { unmount } = render(
        <Header 
          pageName="TELETEXT ZERO" 
          pageNumber={pageNumber} 
          currentTime={testDate} 
        />
      );
      
      const header = screen.getByTestId('teletext-header');
      const headerText = header.textContent || '';
      expect(headerText.length).toBe(GRID.COLUMNS);
      
      unmount();
    });
  });

  it('contains app name at the start', () => {
    const testDate = new Date('2024-01-15T14:30:45');
    render(
      <Header 
        pageName="TELETEXT ZERO" 
        pageNumber={100} 
        currentTime={testDate} 
      />
    );
    
    const header = screen.getByTestId('teletext-header');
    const headerText = header.textContent || '';
    expect(headerText.startsWith('TELETEXT ZERO')).toBe(true);
  });

  it('contains time at the end', () => {
    const testDate = new Date('2024-01-15T14:30:45');
    render(
      <Header 
        pageName="TELETEXT ZERO" 
        pageNumber={100} 
        currentTime={testDate} 
      />
    );
    
    const header = screen.getByTestId('teletext-header');
    const headerText = header.textContent || '';
    expect(headerText.endsWith('14:30:45')).toBe(true);
  });

  it('handles midnight time correctly', () => {
    const testDate = new Date('2024-01-15T00:00:00');
    render(
      <Header 
        pageName="TELETEXT ZERO" 
        pageNumber={100} 
        currentTime={testDate} 
      />
    );
    
    const header = screen.getByTestId('teletext-header');
    expect(header.textContent).toContain('00:00:00');
  });

  it('handles single digit hours and minutes correctly', () => {
    const testDate = new Date('2024-01-15T09:05:03');
    render(
      <Header 
        pageName="TELETEXT ZERO" 
        pageNumber={100} 
        currentTime={testDate} 
      />
    );
    
    const header = screen.getByTestId('teletext-header');
    expect(header.textContent).toContain('09:05:03');
  });
});
