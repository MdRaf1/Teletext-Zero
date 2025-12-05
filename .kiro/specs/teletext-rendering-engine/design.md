# Teletext Rendering Engine - Design Document

## Overview

The Teletext Rendering Engine is a React-based web application built with Vite and TypeScript that faithfully recreates the technical constraints and aesthetic of 1980s broadcast teletext systems. The engine enforces a strict 40x24 character grid, an 8-color palette, and keyboard-only navigation to deliver an authentic "slow web" experience that combats information overload.

The architecture separates concerns into distinct layers: a presentation layer (React components), a state management layer (React hooks and context), a page content system (static page definitions), and a constraint enforcement layer (CSS and TypeScript utilities). This separation ensures that teletext constraints are enforced consistently while maintaining code maintainability.

## Architecture

### High-Level Component Structure

```
App
├── TeletextScreen (Container)
│   ├── StaticNoise (Initial state)
│   ├── TeletextPage (Main display)
│   │   ├── Header
│   │   │   ├── AppName
│   │   │   ├── PageNumber
│   │   │   └── Clock
│   │   └── ContentArea
│   └── PageBuffer (Navigation overlay)
└── KeyboardNavigationHandler (Event listener)
```

### State Management

The application uses React Context for global state management:

- **NavigationContext**: Manages current page number, page buffer, and navigation actions
- **ClockContext**: Manages real-time clock updates
- **PageDataContext**: Provides access to page content definitions

### Data Flow

1. User presses numeric key → KeyboardNavigationHandler captures event
2. Handler updates PageBuffer in NavigationContext
3. When buffer reaches 3 digits → Navigation action triggered
4. Screen clears → New page content loaded from PageDataContext
5. TeletextPage renders with new content

## Components and Interfaces

### TeletextScreen Component

**Purpose**: Root container that manages screen state and transitions

**Props**: None (uses context)

**State**:
- `screenState: 'static' | 'loading' | 'display'`
- `transitionInProgress: boolean`

**Responsibilities**:
- Renders appropriate child component based on screen state
- Manages initialization sequence (static → page 100)
- Handles screen clearing during page transitions
- Applies responsive scaling to maintain aspect ratio

### Header Component

**Purpose**: Renders the standardized top row of every page

**Props**:
```typescript
interface HeaderProps {
  pageName: string;      // e.g., "TELETEXT ZERO"
  pageNumber: number;    // e.g., 100
  currentTime: Date;
}
```

**Responsibilities**:
- Formats and displays app name (left-aligned)
- Formats and displays page number as "P###" (center-aligned)
- Formats and displays time as "HH:MM:SS" (right-aligned)
- Ensures content fits exactly within 40 characters

### ContentArea Component

**Purpose**: Renders page content within the 40x24 grid constraints

**Props**:
```typescript
interface ContentAreaProps {
  content: PageContent;
}

interface PageContent {
  lines: string[];       // Array of up to 23 strings (rows 2-24)
  colors?: ColorMap;     // Optional color specifications per character
}
```

**Responsibilities**:
- Renders content lines in rows 2-24
- Truncates lines exceeding 40 characters
- Truncates content exceeding 23 rows
- Applies color palette constraints

### PageBuffer Component

**Purpose**: Displays the current navigation buffer overlay

**Props**:
```typescript
interface PageBufferProps {
  buffer: string;        // Current buffer state: "", "1", "12", or "123"
  visible: boolean;
}
```

**Responsibilities**:
- Displays buffer with dots for empty positions ("1..", "10.", "123")
- Positions overlay in a consistent screen location
- Shows/hides based on visibility prop

### KeyboardNavigationHandler Component

**Purpose**: Captures and processes keyboard input for navigation

**Props**: None (uses context)

**Responsibilities**:
- Listens for numeric key presses (0-9)
- Updates navigation buffer in context
- Ignores non-numeric keys
- Triggers navigation when buffer is complete

### StaticNoise Component

**Purpose**: Renders the initial static/noise screen

**Props**:
```typescript
interface StaticNoiseProps {
  duration?: number;     // Display duration in milliseconds (default: 1000)
}
```

**Responsibilities**:
- Generates random character pattern to simulate TV static
- Uses only Black and White from color palette
- Triggers transition to page 100 after duration

### Clock Hook

**Purpose**: Provides real-time clock updates

**Interface**:
```typescript
function useClock(): Date {
  // Returns current time, updates every second
}
```

**Implementation**:
- Uses setInterval to update every 1000ms
- Cleans up interval on unmount
- Returns Date object for formatting flexibility

### Navigation Hook

**Purpose**: Manages page navigation state and actions

**Interface**:
```typescript
interface NavigationState {
  currentPage: number;
  pageBuffer: string;
  isNavigating: boolean;
}

interface NavigationActions {
  addDigit: (digit: string) => void;
  clearBuffer: () => void;
  navigateToPage: (pageNumber: number) => void;
}

function useNavigation(): [NavigationState, NavigationActions];
```

## Data Models

### Page Definition

```typescript
interface PageDefinition {
  pageNumber: number;
  title: string;
  content: string[];           // Array of content lines (max 23)
  subPages?: PageDefinition[]; // Optional sub-pages
  colors?: ColorMap;           // Optional color specifications
}

interface ColorMap {
  [row: number]: {
    [col: number]: TeletextColor;
  };
}

type TeletextColor = 
  | 'black'
  | 'white'
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'cyan'
  | 'magenta';
```

### Page Registry

```typescript
interface PageRegistry {
  [pageNumber: number]: PageDefinition;
}

// Example:
const pages: PageRegistry = {
  100: {
    pageNumber: 100,
    title: "Index",
    content: [
      "WELCOME TO TELETEXT ZERO",
      "",
      "Main Sections:",
      "200 - News",
      "300 - Tech News",
      "400 - Weather",
      "500 - Sports",
    ]
  },
  300: {
    pageNumber: 300,
    title: "Tech News",
    content: [
      "TECHNOLOGY NEWS",
      "",
      "Latest updates from the tech world...",
    ]
  }
};
```

### Grid Constraints

```typescript
interface GridConstraints {
  readonly COLUMNS: 40;
  readonly ROWS: 24;
  readonly HEADER_ROW: 1;
  readonly CONTENT_START_ROW: 2;
  readonly CONTENT_ROWS: 23;
}

const GRID: GridConstraints = {
  COLUMNS: 40,
  ROWS: 24,
  HEADER_ROW: 1,
  CONTENT_START_ROW: 2,
  CONTENT_ROWS: 23,
};
```

### Color Palette

```typescript
const TELETEXT_COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
  yellow: '#FFFF00',
  cyan: '#00FFFF',
  magenta: '#FF00FF',
} as const;
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Grid Dimension Invariant

*For any* page content, the rendered output shall always be exactly 40 columns by 24 rows, with any overflow truncated at these boundaries.

**Validates: Requirements 1.1, 1.2, 1.3**

### Property 2: Aspect Ratio Preservation

*For any* viewport size, when the browser window is resized, the character grid shall scale proportionally while maintaining the 40:24 aspect ratio.

**Validates: Requirements 1.4**

### Property 3: Scroll Prevention

*For any* page content, the content area shall have no scrolling behavior enabled, regardless of content length.

**Validates: Requirements 1.5**

### Property 4: Background Color Consistency

*For any* page, the background color shall always be black.

**Validates: Requirements 2.2**

### Property 5: Color Palette Constraint

*For any* visual element rendered, all colors used shall be exclusively from the 8-color teletext palette (Black, White, Red, Green, Blue, Yellow, Cyan, Magenta), and any color value outside this palette shall be rejected.

**Validates: Requirements 2.3, 2.4**

### Property 6: Navigation Buffer State Machine

*For any* sequence of numeric key presses, the page buffer shall correctly accumulate digits (displaying "1..", "10.", "123"), trigger navigation when the third digit is entered, and clear the buffer after navigation completes.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 7: Non-Numeric Key Filtering

*For any* non-numeric key press during page number entry, the keystroke shall be ignored and the page buffer shall remain unchanged.

**Validates: Requirements 3.5**

### Property 8: Mouse Navigation Prevention

*For any* content element, no clickable links or mouse-based navigation shall be possible within the content area.

**Validates: Requirements 3.6**

### Property 9: Header Structure Invariant

*For any* page, row 1 shall always contain a header with "TELETEXT ZERO" left-aligned, the page number in format "P###" center-aligned, and a clock in format "HH:MM:SS" right-aligned, with the header never overflowing into row 2.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.6**

### Property 10: Clock Update Behavior

*For any* one-second time interval, the clock display shall update to reflect the current time.

**Validates: Requirements 4.5**

### Property 11: Initialization Sequence

*For any* application start, the system shall display a static noise pattern, then after at least 1 second transition by clearing the screen and rendering page 100.

**Validates: Requirements 5.1, 5.2, 5.3, 5.4**

### Property 12: Page Number Range

*For any* page number from 100 to 999, the system shall accept it as valid, and for any valid page number, the system shall render the corresponding content.

**Validates: Requirements 6.1, 6.2**

### Property 13: Undefined Page Handling

*For any* undefined page number, the system shall display an error message that fits within the 40x24 grid constraints.

**Validates: Requirements 6.3**

### Property 14: Content Area Reservation

*For any* page, row 1 shall be reserved exclusively for the header, and rows 2-24 shall be reserved exclusively for content, with no overlap.

**Validates: Requirements 6.4**

### Property 15: Character Grid Cell Consistency

*For any* character rendered, it shall occupy exactly one grid cell with consistent width, ensuring that exactly 40 characters fit in one row.

**Validates: Requirements 7.3, 7.4**

### Property 16: Page Transition Sequence

*For any* navigation event, the system shall clear all content to display a blank black screen, then render the complete new page (including header and content) within 500 milliseconds.

**Validates: Requirements 8.1, 8.2, 8.3, 8.4**

## Error Handling

### Invalid Page Numbers

When a user navigates to a page number that doesn't exist in the PageRegistry:
- Display an error page within the 40x24 grid
- Show the requested page number
- Provide a message like "PAGE NOT FOUND"
- Suggest returning to page 100 (index)
- Maintain all teletext constraints (header, colors, grid)

### Malformed Content

When page content doesn't conform to expected format:
- Truncate lines exceeding 40 characters
- Truncate content exceeding 23 rows
- Log warning to console for debugging
- Render whatever content is valid

### Clock Synchronization

If the clock update interval fails:
- Attempt to restart the interval
- Log error to console
- Continue displaying last known time
- Don't crash the application

### Keyboard Event Conflicts

If multiple keyboard handlers conflict:
- Prioritize navigation handler
- Prevent event bubbling after handling
- Ignore duplicate events within short time window

### Responsive Scaling Edge Cases

If viewport becomes extremely small or large:
- Set minimum scale factor to maintain readability
- Set maximum scale factor to prevent pixelation
- Maintain aspect ratio at all scales
- Center the grid in the viewport

## Testing Strategy

### Unit Testing

The application will use **Vitest** as the testing framework for unit tests. Unit tests will focus on:

1. **Utility Functions**:
   - Text truncation at 40 characters
   - Line array truncation at 23 rows
   - Time formatting (HH:MM:SS)
   - Page number formatting (P###)
   - Buffer display formatting ("1..", "10.", "123")

2. **Component Rendering**:
   - Header component renders with correct structure
   - ContentArea component applies truncation
   - PageBuffer component displays correct format
   - StaticNoise component generates valid pattern

3. **Hook Behavior**:
   - useClock returns current time and updates
   - useNavigation manages state correctly
   - Navigation actions update state as expected

4. **Edge Cases**:
   - Empty content arrays
   - Content with special characters
   - Page numbers at boundaries (100, 999)
   - Invalid page numbers (99, 1000)

### Property-Based Testing

The application will use **fast-check** as the property-based testing library. Property-based tests will verify universal properties across many randomly generated inputs:

1. **Configuration**:
   - Each property test shall run a minimum of 100 iterations
   - Tests shall use appropriate generators for teletext constraints
   - Each test shall be tagged with a comment referencing the design document property

2. **Test Tag Format**:
   ```typescript
   // Feature: teletext-rendering-engine, Property 1: Grid Dimension Invariant
   ```

3. **Property Test Coverage**:
   - Each correctness property (1-16) shall be implemented by exactly one property-based test
   - Tests shall generate random valid inputs within teletext constraints
   - Tests shall verify that properties hold across all generated inputs

4. **Generators**:
   - Random page content (varying lengths, characters)
   - Random page numbers (100-999, including invalid ranges)
   - Random viewport dimensions
   - Random key press sequences
   - Random color values (valid and invalid)
   - Random time values

5. **Property Test Examples**:
   - Generate random content → verify output is always 40x24
   - Generate random page numbers → verify valid range acceptance
   - Generate random key sequences → verify buffer state machine
   - Generate random colors → verify palette constraint
   - Generate random viewport sizes → verify aspect ratio

### Integration Testing

Integration tests will verify component interactions:

1. **Navigation Flow**:
   - User types "300" → Page 300 loads with correct content
   - Navigation clears screen → New page renders completely

2. **Initialization Flow**:
   - App starts → Static screen appears → Page 100 loads

3. **Clock Integration**:
   - Clock updates every second across page transitions
   - Clock maintains correct format in header

4. **Keyboard Handler Integration**:
   - Keyboard events update buffer → Buffer updates trigger navigation
   - Non-numeric keys are filtered correctly

### Visual Regression Testing

While not automated initially, visual testing should verify:
- Grid alignment and spacing
- Color palette accuracy
- Font rendering consistency
- Responsive scaling behavior
- Static noise pattern appearance

## Implementation Notes

### CSS Architecture

Use CSS custom properties for:
- Color palette (8 colors)
- Grid dimensions (40 columns, 24 rows)
- Character cell size
- Scaling factors

Use CSS Grid for layout:
- 40-column by 24-row grid
- Fixed cell sizes with responsive scaling
- No gaps between cells

### Performance Considerations

- Minimize re-renders by memoizing components
- Use React.memo for Header, ContentArea components
- Debounce keyboard events if necessary
- Optimize clock updates to only affect clock component
- Use CSS transforms for scaling (GPU-accelerated)

### Accessibility Considerations

While maintaining teletext aesthetic:
- Provide semantic HTML structure
- Include ARIA labels for screen readers
- Ensure sufficient color contrast (teletext colors are high contrast)
- Support keyboard navigation (already core feature)
- Provide skip links if needed

### Browser Compatibility

Target modern browsers:
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)

Use standard CSS Grid and Flexbox (widely supported)
Avoid experimental CSS features
Test responsive scaling across devices

### Development Workflow

1. Set up Vite + React + TypeScript project
2. Configure Vitest and fast-check
3. Implement core data models and constants
4. Build components bottom-up (Header → ContentArea → TeletextPage)
5. Implement state management (hooks and context)
6. Add keyboard navigation
7. Implement page transitions
8. Add static noise screen
9. Create initial page content (100, 300)
10. Test and refine

### Future Enhancements (Out of Scope for Phase 1)

- Sub-page navigation (100/2, 100/3)
- Page history (back button)
- Reveal/conceal text (classic teletext feature)
- Flashing text
- Graphics characters (block graphics)
- CRT scan line effects
- Color cycling animations
- Sound effects (page turn beep)
