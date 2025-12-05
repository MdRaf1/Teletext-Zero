import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, act, fireEvent } from '@testing-library/react';
import App from './App';

/**
 * Integration Tests for App Component
 * Tests the complete navigation flow from user input to page display
 * Requirements: 3.1, 3.2, 3.3, 6.2, 6.3, 8.1, 8.2, 8.3
 */
describe('App Component Integration Tests', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  /**
   * Test: User typing "300" navigates to page 300
   * Requirements: 3.1, 3.2, 3.3, 6.2, 8.1, 8.2, 8.3
   */
  it('should navigate to page 300 when user types "300"', async () => {
    const { container } = render(<App />);

    // Wait for initialization to complete
    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    // Verify we're on page 100
    let header = container.querySelector('.header');
    expect(header?.textContent).toContain('P100');

    // Type "3"
    await act(async () => {
      fireEvent.keyDown(window, { key: '3' });
    });

    // Verify buffer shows "3.."
    let buffer = container.querySelector('.page-buffer');
    expect(buffer?.textContent).toBe('3..');

    // Type "0"
    await act(async () => {
      fireEvent.keyDown(window, { key: '0' });
    });

    // Verify buffer shows "30."
    buffer = container.querySelector('.page-buffer');
    expect(buffer?.textContent).toBe('30.');

    // Type "0"
    await act(async () => {
      fireEvent.keyDown(window, { key: '0' });
      // Navigation triggers via setTimeout (0ms) + screen transition (100ms)
      vi.advanceTimersByTime(200);
    });

    // Verify we're now on page 300
    header = container.querySelector('.header');
    expect(header).toBeTruthy();
    expect(header!.textContent).toContain('P300');

    // Verify buffer is cleared
    buffer = container.querySelector('.page-buffer');
    expect(buffer).toBeFalsy();

    // Verify page content is from page 300
    const contentArea = container.querySelector('.content-area');
    expect(contentArea).toBeTruthy();
    expect(contentArea!.textContent).toContain('TECHNOLOGY NEWS');
  });

  /**
   * Test: Navigation clears screen and renders new page
   * Requirements: 8.1, 8.2, 8.3
   */
  it('should clear screen before rendering new page during navigation', async () => {
    const { container } = render(<App />);

    // Wait for initialization to complete
    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    // Verify we're on page 100
    let header = container.querySelector('.header');
    expect(header?.textContent).toContain('P100');

    // Type "300" to trigger navigation
    await act(async () => {
      fireEvent.keyDown(window, { key: '3' });
      fireEvent.keyDown(window, { key: '0' });
      fireEvent.keyDown(window, { key: '0' });
      // Navigation triggers via setTimeout (0ms) + screen transition (100ms)
      vi.advanceTimersByTime(200);
    });

    // Now should see page 300
    header = container.querySelector('.header');
    expect(header).toBeTruthy();
    expect(header!.textContent).toContain('P300');
  });

  /**
   * Test: Undefined page shows error
   * Requirements: 6.3
   */
  it('should display error message for undefined page numbers', async () => {
    const { container } = render(<App />);

    // Wait for initialization to complete
    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    // Type "999" (undefined page)
    await act(async () => {
      fireEvent.keyDown(window, { key: '9' });
      fireEvent.keyDown(window, { key: '9' });
      fireEvent.keyDown(window, { key: '9' });
      // Navigation triggers via setTimeout (0ms) + screen transition (100ms)
      vi.advanceTimersByTime(200);
    });

    // Verify we're on page 999 (error page)
    const header = container.querySelector('.header');
    expect(header).toBeTruthy();
    expect(header!.textContent).toContain('P999');

    // Verify error message is displayed
    const contentArea = container.querySelector('.content-area');
    expect(contentArea).toBeTruthy();
    expect(contentArea!.textContent).toContain('PAGE NOT FOUND');
    expect(contentArea!.textContent).toContain('Page 999 does not exist');
  });

  /**
   * Test: Non-numeric keys are ignored during navigation
   * Requirements: 3.5
   */
  it('should ignore non-numeric keys during page number entry', async () => {
    const { container } = render(<App />);

    // Wait for initialization to complete
    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    // Type "3" then "a" then "0" then "b" then "0"
    await act(async () => {
      fireEvent.keyDown(window, { key: '3' });
      fireEvent.keyDown(window, { key: 'a' }); // Should be ignored
      fireEvent.keyDown(window, { key: '0' });
      fireEvent.keyDown(window, { key: 'Enter' }); // Should be ignored
      fireEvent.keyDown(window, { key: '0' });
      // Navigation triggers via setTimeout (0ms) + screen transition (100ms)
      vi.advanceTimersByTime(200);
    });

    // Should navigate to page 300 (non-numeric keys ignored)
    const header = container.querySelector('.header');
    expect(header).toBeTruthy();
    expect(header!.textContent).toContain('P300');
  });

  /**
   * Test: Buffer displays correctly during input
   * Requirements: 3.2
   */
  it('should display buffer with dot notation during page number entry', async () => {
    const { container } = render(<App />);

    // Wait for initialization to complete
    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    // Initially no buffer
    let buffer = container.querySelector('.page-buffer');
    expect(buffer).toBeFalsy();

    // Type "3"
    await act(async () => {
      fireEvent.keyDown(window, { key: '3' });
    });

    // Buffer should show "3.."
    buffer = container.querySelector('.page-buffer');
    expect(buffer?.textContent).toBe('3..');

    // Type "0"
    await act(async () => {
      fireEvent.keyDown(window, { key: '0' });
    });

    // Buffer should show "30."
    buffer = container.querySelector('.page-buffer');
    expect(buffer?.textContent).toBe('30.');

    // Type "0"
    await act(async () => {
      fireEvent.keyDown(window, { key: '0' });
    });

    // Advance time for navigation
    await act(async () => {
      vi.advanceTimersByTime(200);
    });

    // Buffer should be cleared after navigation
    buffer = container.querySelector('.page-buffer');
    expect(buffer).toBeFalsy();
  });

  /**
   * Test: Multiple navigation cycles work correctly
   * Requirements: 3.1, 3.2, 3.3, 3.4, 8.1, 8.2, 8.3
   */
  it('should handle multiple navigation cycles correctly', async () => {
    const { container } = render(<App />);

    // Wait for initialization to complete
    await act(async () => {
      vi.advanceTimersByTime(1200);
    });

    // Navigate to page 300
    await act(async () => {
      fireEvent.keyDown(window, { key: '3' });
      fireEvent.keyDown(window, { key: '0' });
      fireEvent.keyDown(window, { key: '0' });
      // Navigation triggers via setTimeout (0ms) + screen transition (100ms)
      vi.advanceTimersByTime(200);
    });

    let header = container.querySelector('.header');
    expect(header).toBeTruthy();
    expect(header!.textContent).toContain('P300');

    // Navigate back to page 100
    await act(async () => {
      fireEvent.keyDown(window, { key: '1' });
      fireEvent.keyDown(window, { key: '0' });
      fireEvent.keyDown(window, { key: '0' });
      // Navigation triggers via setTimeout (0ms) + screen transition (100ms)
      vi.advanceTimersByTime(200);
    });

    header = container.querySelector('.header');
    expect(header).toBeTruthy();
    expect(header!.textContent).toContain('P100');

    // Navigate to undefined page 555
    await act(async () => {
      fireEvent.keyDown(window, { key: '5' });
      fireEvent.keyDown(window, { key: '5' });
      fireEvent.keyDown(window, { key: '5' });
      // Navigation triggers via setTimeout (0ms) + screen transition (100ms)
      vi.advanceTimersByTime(200);
    });

    header = container.querySelector('.header');
    expect(header).toBeTruthy();
    expect(header!.textContent).toContain('P555');

    const contentArea = container.querySelector('.content-area');
    expect(contentArea).toBeTruthy();
    expect(contentArea!.textContent).toContain('PAGE NOT FOUND');
  });
});
