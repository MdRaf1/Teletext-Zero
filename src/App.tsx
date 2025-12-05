import { TeletextScreen } from './components/TeletextScreen';
import { KeyboardNavigationHandler } from './components/KeyboardNavigationHandler';
import { PageBuffer } from './components/PageBuffer';
import { useNavigation } from './hooks/useNavigation';
import './App.css';
import './styles/crt-effects.css';

/**
 * App Component - Root component for Teletext Zero
 * 
 * Integrates:
 * - TeletextScreen: Main display with initialization sequence
 * - KeyboardNavigationHandler: Captures numeric key presses
 * - PageBuffer: Shows navigation buffer overlay
 * - useNavigation: Manages navigation state
 * - CRT Effects: Haunted 1980s television aesthetic
 * 
 * Initialization sequence:
 * 1. Static screen displays for 1 second
 * 2. Screen clears (loading state)
 * 3. Page 100 (index) displays
 * 
 * Navigation flow:
 * 1. User types 3-digit page number
 * 2. Buffer displays progress ("1..", "10.", "123")
 * 3. On third digit, navigation triggers
 * 4. Screen clears and new page loads
 * 5. Undefined pages show error message
 * 
 * Requirements: 5.1, 5.2, 5.3, 5.4, 6.2, 6.3
 */
function App() {
  // Initialize navigation with page 100 as default
  const [navigationState, navigationActions] = useNavigation(100);

  return (
    <div className="crt-overlay">
      {/* Main teletext screen with initialization sequence */}
      <TeletextScreen currentPage={navigationState.currentPage} />
      
      {/* CRT effect overlays */}
      <div className="crt-noise" aria-hidden="true" />
      <div className="crt-scanlines" aria-hidden="true" />
      <div className="crt-flicker" aria-hidden="true" />
      <div className="crt-vignette" aria-hidden="true" />
      <div className="crt-curvature" aria-hidden="true" />
      <div className="crt-interference" aria-hidden="true" />
      <div className="crt-reflection" aria-hidden="true" />
      
      {/* Keyboard navigation handler - captures numeric keys */}
      <KeyboardNavigationHandler addDigit={navigationActions.addDigit} />
      
      {/* Page buffer overlay - shows navigation progress */}
      <PageBuffer 
        buffer={navigationState.pageBuffer} 
        visible={navigationState.pageBuffer.length > 0}
      />
    </div>
  );
}

export default App;
