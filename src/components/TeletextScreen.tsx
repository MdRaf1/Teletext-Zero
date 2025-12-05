import { useState, useEffect, useCallback } from 'react';
import { TeletextPage } from './TeletextPage';
import { StaticNoise } from './StaticNoise';
import { getPage } from '../pages/registry';
import { useGlitchEffect } from '../hooks/useGlitchEffect';
import type { PageContent } from '../types';
import './TeletextScreen.css';

export type ScreenState = 'static' | 'loading' | 'display';

export interface TeletextScreenProps {
  currentPage: number;
  onInitComplete?: () => void;
}

/**
 * TeletextScreen container component
 * Manages screen state transitions and responsive scaling
 * Renders StaticNoise, blank screen, or TeletextPage based on state
 * Includes Page 666 "Ghost in the Machine" glitch effects
 * Supports dynamic content loading for pages with async data
 */
export function TeletextScreen({ currentPage, onInitComplete }: TeletextScreenProps) {
  const [screenState, setScreenState] = useState<ScreenState>('static');
  const [displayedPage, setDisplayedPage] = useState<number>(100);
  const [isInitialized, setIsInitialized] = useState(false);
  const [dynamicContent, setDynamicContent] = useState<string[] | null>(null);
  const [isLoadingDynamic, setIsLoadingDynamic] = useState(false);

  // Load dynamic content for a page
  const loadDynamicContent = useCallback(async (pageNumber: number) => {
    const pageDef = getPage(pageNumber);
    if (pageDef.dynamicContent) {
      setIsLoadingDynamic(true);
      setDynamicContent(null);
      try {
        const content = await pageDef.dynamicContent();
        setDynamicContent(content);
      } catch (error) {
        console.error('Failed to load dynamic content:', error);
        setDynamicContent(['ERROR LOADING CONTENT', '', 'Please try again later.']);
      } finally {
        setIsLoadingDynamic(false);
      }
    } else {
      setDynamicContent(null);
    }
  }, []);

  // Handle initialization sequence: static -> page 100
  useEffect(() => {
    if (!isInitialized) {
      // Start with static screen, then transition to page 100
      const timer = setTimeout(() => {
        setScreenState('loading');
        setTimeout(() => {
          setDisplayedPage(100);
          setScreenState('display');
          setIsInitialized(true);
          onInitComplete?.();
        }, 100); // Brief loading screen
      }, 1000); // Static screen for at least 1 second

      return () => clearTimeout(timer);
    }
  }, [isInitialized, onInitComplete]);

  // Handle page transitions after initialization
  useEffect(() => {
    if (isInitialized && currentPage !== displayedPage) {
      // Clear screen before showing new page
      setScreenState('loading');
      setDynamicContent(null);
      
      const timer = setTimeout(() => {
        setDisplayedPage(currentPage);
        setScreenState('display');
        // Load dynamic content after page transition
        loadDynamicContent(currentPage);
      }, 100); // Brief loading screen (well under 500ms requirement)

      return () => clearTimeout(timer);
    }
  }, [currentPage, displayedPage, isInitialized, loadDynamicContent]);

  // Get page content
  const pageDefinition = getPage(displayedPage);
  
  // Use dynamic content if loaded, otherwise use static content
  const baseContent = dynamicContent || pageDefinition.content;
  
  // Show loading indicator if fetching dynamic content
  const originalContent = isLoadingDynamic
    ? [...pageDefinition.content.slice(0, 3), '', 'FETCHING DATA...', '', 'Please wait.']
    : baseContent;
  
  // Page 666 glitch effects
  const isPage666 = displayedPage === 666;
  const glitchState = useGlitchEffect({
    enabled: isPage666 && screenState === 'display',
    originalContent,
  });

  // Determine what content to display
  let displayContent: string[];
  if (isPage666 && glitchState.hasFinalMessage) {
    displayContent = glitchState.finalContent;
  } else if (isPage666 && glitchState.isGlitching && glitchState.glitchedContent) {
    displayContent = glitchState.glitchedContent;
  } else {
    displayContent = originalContent;
  }

  const pageContent: PageContent = {
    lines: displayContent,
    colors: pageDefinition.colors,
  };

  // CSS classes for glitch effects
  const containerClasses = [
    'teletext-screen-container',
    isPage666 ? 'page-666' : '',
    glitchState.isBackgroundFlashing ? 'background-flash' : '',
    glitchState.isGlitching ? 'glitching' : '',
  ].filter(Boolean).join(' ');

  return (
    <div className="teletext-screen" data-testid="teletext-screen">
      <div className={containerClasses}>
        {screenState === 'static' && (
          <StaticNoise 
            duration={1000}
            onComplete={() => {
              // Handled by initialization effect
            }}
          />
        )}
        
        {screenState === 'loading' && (
          <div className="teletext-loading" data-testid="teletext-loading">
            {/* Blank black screen */}
          </div>
        )}
        
        {screenState === 'display' && (
          <TeletextPage 
            pageNumber={displayedPage}
            pageContent={pageContent}
          />
        )}
      </div>
    </div>
  );
}
