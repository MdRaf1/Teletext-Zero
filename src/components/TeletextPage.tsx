import { Header } from './Header';
import { ContentArea } from './ContentArea';
import { useClock } from '../hooks/useClock';
import type { PageContent } from '../types';
import './TeletextPage.css';

export interface TeletextPageProps {
  pageNumber: number;
  pageContent: PageContent;
  pageName?: string;
}

/**
 * TeletextPage component - combines Header and ContentArea
 * Renders a complete teletext page with header in row 1 and content in rows 2-24
 * Uses CSS Grid layout to enforce 40x24 character grid
 */
export function TeletextPage({ 
  pageNumber, 
  pageContent, 
  pageName = 'TELETEXT ZERO' 
}: TeletextPageProps) {
  const currentTime = useClock();

  return (
    <div className="teletext-page" data-testid="teletext-page">
      <Header 
        pageName={pageName}
        pageNumber={pageNumber}
        currentTime={currentTime}
      />
      <ContentArea content={pageContent} />
    </div>
  );
}
