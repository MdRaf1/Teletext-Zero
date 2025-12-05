# Implementation Plan

- [x] 1. Initialize project structure and dependencies
  - Create Vite + React + TypeScript project
  - Install dependencies: Vitest, fast-check, @testing-library/react
  - Configure Vitest for unit and property-based testing
  - Set up Google Fonts (VT323 or Share Tech Mono)
  - Create directory structure: components/, hooks/, types/, constants/, pages/
  - _Requirements: 7.1, 7.2_

- [x] 2. Define core constants and types
  - Create constants file with GRID dimensions (40x24), TELETEXT_COLORS palette
  - Define TypeScript interfaces: PageDefinition, PageContent, ColorMap, TeletextColor, GridConstraints
  - Export color palette as CSS custom properties
  - _Requirements: 1.1, 2.1, 6.5, 7.3_

- [x] 2.1 Write property test for color palette constraint
  - **Property 5: Color Palette Constraint**
  - **Validates: Requirements 2.3, 2.4**

- [x] 3. Implement utility functions
  - Create text truncation function (40 character limit)
  - Create line array truncation function (23 row limit)
  - Create time formatter (HH:MM:SS)
  - Create page number formatter (P###)
  - Create buffer display formatter ("1..", "10.", "123")
  - _Requirements: 1.2, 1.3, 4.3, 4.4, 3.2_

- [x] 3.1 Write unit tests for utility functions
  - Test truncation with various input lengths
  - Test formatters with edge cases
  - Test buffer display for all states (0-3 digits)
  - _Requirements: 1.2, 1.3, 4.3, 4.4, 3.2_

- [x] 3.2 Write property test for grid dimension invariant
  - **Property 1: Grid Dimension Invariant**
  - **Validates: Requirements 1.1, 1.2, 1.3**

- [x] 4. Create Clock hook
  - Implement useClock hook with setInterval (1000ms)
  - Return current Date object
  - Clean up interval on unmount
  - _Requirements: 4.4, 4.5_

- [x] 4.1 Write property test for clock update behavior
  - **Property 10: Clock Update Behavior**
  - **Validates: Requirements 4.5**

- [x] 5. Implement Header component
  - Create Header component with props: pageName, pageNumber, currentTime
  - Render app name left-aligned
  - Render page number center-aligned (P### format)
  - Render clock right-aligned (HH:MM:SS format)
  - Ensure total width is exactly 40 characters
  - Apply teletext color styling
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6_

- [x] 5.1 Write unit tests for Header component
  - Test rendering with various page numbers
  - Test alignment and formatting
  - Test 40-character width constraint
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6_

- [x] 5.2 Write property test for header structure invariant
  - **Property 9: Header Structure Invariant**
  - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.6**

- [x] 6. Implement ContentArea component
  - Create ContentArea component with props: content (PageContent)
  - Render content lines in rows 2-24
  - Apply truncation utilities to enforce 40x23 constraints
  - Apply color styling from ColorMap if provided
  - _Requirements: 1.2, 1.3, 6.4_

- [x] 6.1 Write unit tests for ContentArea component
  - Test rendering with various content lengths
  - Test truncation behavior
  - Test color application
  - _Requirements: 1.2, 1.3, 6.4_

- [x] 6.2 Write property test for content area reservation
  - **Property 14: Content Area Reservation**
  - **Validates: Requirements 6.4**

- [x] 7. Create page registry and initial pages
  - Create PageRegistry data structure
  - Define page 100 (Index) with welcome message and section links
  - Define page 300 (Tech News) with placeholder content
  - Define error page template for undefined pages
  - _Requirements: 5.4, 6.1, 6.2, 6.3_

- [x] 7.1 Write property test for page number range
  - **Property 12: Page Number Range**
  - **Validates: Requirements 6.1, 6.2**

- [x] 7.2 Write property test for undefined page handling
  - **Property 13: Undefined Page Handling**
  - **Validates: Requirements 6.3**

- [x] 8. Implement Navigation hook
  - Create useNavigation hook with state: currentPage, pageBuffer, isNavigating
  - Implement addDigit action (append to buffer)
  - Implement clearBuffer action
  - Implement navigateToPage action
  - Trigger navigation automatically when buffer reaches 3 digits
  - Clear buffer after navigation
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [x] 8.1 Write property test for navigation buffer state machine
  - **Property 6: Navigation Buffer State Machine**
  - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

- [x] 9. Implement PageBuffer component
  - Create PageBuffer component with props: buffer, visible
  - Display buffer with dot notation ("1..", "10.", "123")
  - Position overlay in consistent screen location
  - Show/hide based on visible prop
  - Apply teletext styling
  - _Requirements: 3.2_

- [x] 9.1 Write unit tests for PageBuffer component
  - Test display format for all buffer states
  - Test visibility toggling
  - _Requirements: 3.2_

- [x] 10. Implement KeyboardNavigationHandler component
  - Create component that listens for keydown events
  - Filter for numeric keys (0-9)
  - Call addDigit action from useNavigation
  - Ignore non-numeric keys
  - Prevent event bubbling after handling
  - _Requirements: 3.1, 3.5, 3.6_

- [x] 10.1 Write property test for non-numeric key filtering
  - **Property 7: Non-Numeric Key Filtering**
  - **Validates: Requirements 3.5**

- [x] 10.2 Write property test for mouse navigation prevention
  - **Property 8: Mouse Navigation Prevention**
  - **Validates: Requirements 3.6**

- [x] 11. Implement StaticNoise component
  - Create StaticNoise component with props: duration (default 1000ms)
  - Generate random character pattern using black and white colors
  - Fill entire 40x24 grid
  - Trigger callback after duration to transition to page 100
  - _Requirements: 5.1, 5.2_

- [x] 11.1 Write unit tests for StaticNoise component
  - Test random pattern generation
  - Test color constraints (black/white only)
  - Test grid dimensions
  - _Requirements: 5.1_

- [x] 12. Implement TeletextPage component
  - Create TeletextPage component that combines Header and ContentArea
  - Accept page number and page content as props
  - Use useClock hook for header time
  - Render Header in row 1
  - Render ContentArea in rows 2-24
  - Apply CSS Grid layout (40x24)
  - _Requirements: 1.1, 4.1, 6.4_

- [x] 12.1 Write unit tests for TeletextPage component
  - Test integration of Header and ContentArea
  - Test layout structure
  - _Requirements: 1.1, 4.1, 6.4_

- [x] 13. Implement TeletextScreen container component
  - Create TeletextScreen component with state: screenState ('static' | 'loading' | 'display')
  - Manage screen transitions
  - Render StaticNoise when screenState is 'static'
  - Render TeletextPage when screenState is 'display'
  - Render blank black screen when screenState is 'loading'
  - Implement responsive scaling to maintain aspect ratio
  - _Requirements: 1.4, 5.1, 5.2, 5.3, 8.1, 8.2_

- [x] 13.1 Write property test for aspect ratio preservation
  - **Property 2: Aspect Ratio Preservation**
  - **Validates: Requirements 1.4**

- [x] 13.2 Write property test for page transition sequence
  - **Property 16: Page Transition Sequence**
  - **Validates: Requirements 8.1, 8.2, 8.3, 8.4**

- [x] 14. Implement CSS styling system
  - Create global CSS with teletext color palette as custom properties
  - Define CSS Grid layout for 40x24 character grid
  - Set monospace font (VT323 or Share Tech Mono fallback)
  - Style background as black
  - Implement responsive scaling using CSS transforms
  - Disable scrolling (overflow: hidden)
  - Ensure each character occupies one grid cell
  - _Requirements: 1.1, 1.4, 1.5, 2.1, 2.2, 7.1, 7.2, 7.3, 7.4_

- [x] 14.1 Write property test for scroll prevention
  - **Property 3: Scroll Prevention**
  - **Validates: Requirements 1.5**

- [x] 14.2 Write property test for background color consistency
  - **Property 4: Background Color Consistency**
  - **Validates: Requirements 2.2**

- [x] 14.3 Write property test for character grid cell consistency
  - **Property 15: Character Grid Cell Consistency**
  - **Validates: Requirements 7.3, 7.4**

- [x] 15. Implement App component and initialization flow
  - Create App component as root
  - Integrate TeletextScreen, KeyboardNavigationHandler, PageBuffer
  - Set up NavigationContext provider
  - Implement initialization sequence: static screen → page 100
  - Wire up navigation to load pages from registry
  - Handle undefined pages with error display
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.2, 6.3_

- [x] 15.1 Write property test for initialization sequence
  - **Property 11: Initialization Sequence**
  - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**

- [x] 15.2 Write integration tests for navigation flow
  - Test user typing "300" navigates to page 300
  - Test navigation clears screen and renders new page
  - Test undefined page shows error
  - _Requirements: 3.1, 3.2, 3.3, 6.2, 6.3, 8.1, 8.2, 8.3_

- [x] 16. Final checkpoint - Ensure all tests pass
  - Run all unit tests and verify they pass
  - Run all property-based tests and verify they pass
  - Manually test the application in browser
  - Verify initialization flow works correctly
  - Verify navigation from page 100 to page 300 works
  - Verify responsive scaling maintains aspect ratio
  - Ask the user if questions arise
