# Requirements Document

## Introduction

Teletext Zero is a "Slow Web" browser that resurrects the aesthetic and technical limitations of 1980s TV Teletext systems. This requirements document defines the core Teletext Rendering Engine - a React-based web application that enforces the strict technical constraints of 1980s television sets, including a fixed character grid, limited color palette, and keyboard-only navigation. The engine combats information overload by presenting content as static, non-scrolling, blocky pages reminiscent of classic broadcast teletext services.

## Glossary

- **Teletext Rendering Engine**: The core React application component responsible for rendering content within teletext constraints
- **Character Grid**: A fixed 40 columns by 24 rows display area for text content
- **Page**: A single screen of teletext content identified by a 3-digit number (100-999)
- **Sub-page**: Additional pages of content when information exceeds the 40x24 grid, indicated by notation like "100/2"
- **Page Buffer**: A three-character input buffer that captures user keystrokes for page navigation
- **Header Row**: The top row (row 1) of every page containing app name, page number, and clock
- **Content Area**: Rows 2-24 of the character grid available for page content
- **Color Palette**: The set of 8 allowed colors (Black, White, Red, Green, Blue, Yellow, Cyan, Magenta)
- **Static Screen**: The initial noise/interference pattern displayed before content loads
- **Remote Control Navigation**: Keyboard-only navigation system using 3-digit page numbers

## Requirements

### Requirement 1: Character Grid Constraint System

**User Story:** As a user, I want all content displayed in a strict 40 columns x 24 rows grid, so that the authentic teletext experience is preserved regardless of my screen size.

#### Acceptance Criteria

1. WHEN the Teletext Rendering Engine renders any page, THE Teletext Rendering Engine SHALL display content in exactly 40 columns and 24 rows
2. WHEN content exceeds 40 characters in width, THE Teletext Rendering Engine SHALL truncate the content at the 40th character
3. WHEN content exceeds 24 rows in height, THE Teletext Rendering Engine SHALL truncate the content at the 24th row
4. WHEN the browser window is resized, THE Teletext Rendering Engine SHALL scale the character grid proportionally while maintaining the 40x24 aspect ratio
5. THE Teletext Rendering Engine SHALL prevent any scrolling behavior within the content area

### Requirement 2: Color Palette Enforcement

**User Story:** As a user, I want all visual elements to use only the 8 authentic teletext colors, so that the visual aesthetic matches 1980s television technology.

#### Acceptance Criteria

1. THE Teletext Rendering Engine SHALL define exactly 8 colors as CSS variables: Black, White, Red, Green, Blue, Yellow, Cyan, and Magenta
2. THE Teletext Rendering Engine SHALL render the background color as Black for all pages
3. WHEN rendering any visual element, THE Teletext Rendering Engine SHALL use only colors from the defined 8-color palette
4. THE Teletext Rendering Engine SHALL reject any color values outside the defined palette

### Requirement 3: Keyboard-Based Page Navigation

**User Story:** As a user, I want to navigate between pages by typing 3-digit page numbers on my keyboard, so that I can experience authentic teletext remote control navigation.

#### Acceptance Criteria

1. WHEN a user presses a numeric key (0-9), THE Teletext Rendering Engine SHALL append the digit to the Page Buffer
2. WHEN the Page Buffer contains fewer than 3 digits, THE Teletext Rendering Engine SHALL display the partial buffer with dots representing empty positions (e.g., "1..", "10.")
3. WHEN the Page Buffer receives a third digit, THE Teletext Rendering Engine SHALL execute navigation to the specified page number
4. WHEN navigation is executed, THE Teletext Rendering Engine SHALL clear the Page Buffer
5. WHEN a user presses a non-numeric key during page number entry, THE Teletext Rendering Engine SHALL ignore the keystroke
6. THE Teletext Rendering Engine SHALL prevent any clickable links or mouse-based navigation within the content area

### Requirement 4: Standardized Header Display

**User Story:** As a user, I want every page to display a consistent header with app name, page number, and current time, so that I always know where I am and what time it is.

#### Acceptance Criteria

1. THE Teletext Rendering Engine SHALL display a header in row 1 of the character grid on every page
2. WHEN rendering the header, THE Teletext Rendering Engine SHALL display the text "TELETEXT ZERO" aligned to the left
3. WHEN rendering the header, THE Teletext Rendering Engine SHALL display the current page number in format "P###" (e.g., "P100") aligned to the center
4. WHEN rendering the header, THE Teletext Rendering Engine SHALL display a real-time clock in format "HH:MM:SS" aligned to the right
5. WHEN one second elapses, THE Teletext Rendering Engine SHALL update the clock display to reflect the current time
6. THE Teletext Rendering Engine SHALL ensure the header occupies exactly row 1 and does not overflow into row 2

### Requirement 5: Application Initialization Flow

**User Story:** As a user, I want the application to start with a static screen that transitions to the index page, so that I experience the authentic feeling of a television set warming up.

#### Acceptance Criteria

1. WHEN the Teletext Rendering Engine initializes, THE Teletext Rendering Engine SHALL display a static noise pattern
2. WHEN the static screen has been displayed for at least 1 second, THE Teletext Rendering Engine SHALL transition to page 100
3. WHEN transitioning from static to page 100, THE Teletext Rendering Engine SHALL clear the screen before rendering the new page
4. THE Teletext Rendering Engine SHALL render page 100 as the default index page

### Requirement 6: Page Content Management

**User Story:** As a user, I want pages to be identified by 3-digit numbers and contain structured content, so that I can navigate to specific information categories.

#### Acceptance Criteria

1. THE Teletext Rendering Engine SHALL support page numbers from 100 to 999
2. WHEN a user navigates to a valid page number, THE Teletext Rendering Engine SHALL render the content for that page
3. WHEN a user navigates to an undefined page number, THE Teletext Rendering Engine SHALL display an error message within the 40x24 grid
4. WHEN rendering a page, THE Teletext Rendering Engine SHALL reserve row 1 for the header and rows 2-24 for content
5. THE Teletext Rendering Engine SHALL support sub-page notation (e.g., "100/2") for content that exceeds one page

### Requirement 7: Typography and Visual Rendering

**User Story:** As a developer, I want the application to use a monospace font that approximates the teletext aesthetic, so that the character grid displays correctly.

#### Acceptance Criteria

1. THE Teletext Rendering Engine SHALL use a monospace font for all text rendering
2. WHEN a suitable teletext font is unavailable, THE Teletext Rendering Engine SHALL use 'VT323' or 'Share Tech Mono' from Google Fonts as a fallback
3. THE Teletext Rendering Engine SHALL ensure each character occupies exactly one grid cell
4. THE Teletext Rendering Engine SHALL render characters with consistent width and height ratios appropriate for the 40x24 grid

### Requirement 8: Screen Transition Behavior

**User Story:** As a user, I want page transitions to clear the screen before displaying new content, so that the experience matches authentic teletext behavior.

#### Acceptance Criteria

1. WHEN navigation to a new page is triggered, THE Teletext Rendering Engine SHALL clear all content from the current page
2. WHEN the screen is cleared, THE Teletext Rendering Engine SHALL display a blank black screen
3. WHEN the new page content is ready, THE Teletext Rendering Engine SHALL render the complete page including header and content
4. THE Teletext Rendering Engine SHALL complete the transition within 500 milliseconds
