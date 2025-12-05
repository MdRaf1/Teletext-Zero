import { formatTime, formatPageNumber } from '../utils/formatters';
import { GRID } from '../constants';

export interface HeaderProps {
  pageName: string;
  pageNumber: number;
  currentTime: Date;
}

/**
 * Header component - renders the standardized top row of every teletext page
 * Displays app name (left), page number (center), and clock (right)
 * Total width is exactly 40 characters
 */
export function Header({ pageName, pageNumber, currentTime }: HeaderProps) {
  const formattedTime = formatTime(currentTime);
  const formattedPageNumber = formatPageNumber(pageNumber);

  // Calculate spacing to ensure exactly 40 characters
  // Format: "PAGENAME" + spaces + "P###" + spaces + "HH:MM:SS"
  const leftSection = pageName;
  const centerSection = formattedPageNumber;
  const rightSection = formattedTime;

  // Calculate total content length
  const contentLength = leftSection.length + centerSection.length + rightSection.length;
  const totalSpaces = GRID.COLUMNS - contentLength;

  // Distribute spaces: half before center, half after center
  const spacesBeforeCenter = Math.floor(totalSpaces / 2);
  const spacesAfterCenter = totalSpaces - spacesBeforeCenter;

  const headerText = 
    leftSection + 
    ' '.repeat(spacesBeforeCenter) + 
    centerSection + 
    ' '.repeat(spacesAfterCenter) + 
    rightSection;

  return (
    <div className="header" data-testid="teletext-header">
      {headerText}
    </div>
  );
}
