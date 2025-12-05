import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PageBuffer } from './PageBuffer';

describe('PageBuffer Component', () => {
  describe('Display format for all buffer states', () => {
    it('displays empty buffer as nothing when visible', () => {
      const { container } = render(<PageBuffer buffer="" visible={true} />);
      expect(container.firstChild).toBeNull();
    });

    it('displays single digit with two dots', () => {
      render(<PageBuffer buffer="1" visible={true} />);
      const bufferElement = screen.getByTestId('page-buffer');
      expect(bufferElement.textContent).toBe('1..');
    });

    it('displays two digits with one dot', () => {
      render(<PageBuffer buffer="12" visible={true} />);
      const bufferElement = screen.getByTestId('page-buffer');
      expect(bufferElement.textContent).toBe('12.');
    });

    it('displays three digits without dots', () => {
      render(<PageBuffer buffer="123" visible={true} />);
      const bufferElement = screen.getByTestId('page-buffer');
      expect(bufferElement.textContent).toBe('123');
    });

    it('displays different single digits correctly', () => {
      const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
      
      digits.forEach(digit => {
        const { unmount } = render(<PageBuffer buffer={digit} visible={true} />);
        const bufferElement = screen.getByTestId('page-buffer');
        expect(bufferElement.textContent).toBe(`${digit}..`);
        unmount();
      });
    });

    it('displays different two-digit combinations correctly', () => {
      const combinations = ['10', '25', '99', '00', '42'];
      
      combinations.forEach(combo => {
        const { unmount } = render(<PageBuffer buffer={combo} visible={true} />);
        const bufferElement = screen.getByTestId('page-buffer');
        expect(bufferElement.textContent).toBe(`${combo}.`);
        unmount();
      });
    });

    it('displays different three-digit combinations correctly', () => {
      const combinations = ['100', '300', '999', '000', '456'];
      
      combinations.forEach(combo => {
        const { unmount } = render(<PageBuffer buffer={combo} visible={true} />);
        const bufferElement = screen.getByTestId('page-buffer');
        expect(bufferElement.textContent).toBe(combo);
        unmount();
      });
    });
  });

  describe('Visibility toggling', () => {
    it('does not render when visible is false', () => {
      const { container } = render(<PageBuffer buffer="1" visible={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('renders when visible is true', () => {
      render(<PageBuffer buffer="1" visible={true} />);
      const bufferElement = screen.getByTestId('page-buffer');
      expect(bufferElement).toBeDefined();
    });

    it('does not render empty buffer even when visible', () => {
      const { container } = render(<PageBuffer buffer="" visible={true} />);
      expect(container.firstChild).toBeNull();
    });

    it('hides single digit buffer when visible is false', () => {
      const { container } = render(<PageBuffer buffer="1" visible={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('hides two digit buffer when visible is false', () => {
      const { container } = render(<PageBuffer buffer="12" visible={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('hides three digit buffer when visible is false', () => {
      const { container } = render(<PageBuffer buffer="123" visible={false} />);
      expect(container.firstChild).toBeNull();
    });

    it('shows buffer when toggled from hidden to visible', () => {
      const { rerender } = render(<PageBuffer buffer="1" visible={false} />);
      const { container } = render(<PageBuffer buffer="1" visible={false} />);
      expect(container.firstChild).toBeNull();
      
      rerender(<PageBuffer buffer="1" visible={true} />);
      const bufferElement = screen.getByTestId('page-buffer');
      expect(bufferElement).toBeDefined();
      expect(bufferElement.textContent).toBe('1..');
    });
  });

  describe('Component structure', () => {
    it('has correct test id', () => {
      render(<PageBuffer buffer="1" visible={true} />);
      const bufferElement = screen.getByTestId('page-buffer');
      expect(bufferElement).toBeDefined();
    });

    it('has page-buffer class', () => {
      render(<PageBuffer buffer="1" visible={true} />);
      const bufferElement = screen.getByTestId('page-buffer');
      expect(bufferElement.className).toBe('page-buffer');
    });
  });
});
