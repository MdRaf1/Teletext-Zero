import { truncateText, truncateLines } from '../utils/formatters';
import type { PageContent } from '../types';
import { getTeletextColorHex } from '../constants/colors';

export interface ContentAreaProps {
  content: PageContent;
}

/**
 * ContentArea component - renders page content in rows 2-24
 * Enforces 40x23 character constraints and applies color styling
 */
export function ContentArea({ content }: ContentAreaProps) {
  // Apply truncation to enforce constraints
  const truncatedLines = truncateLines(content.lines);
  const processedLines = truncatedLines.map(line => truncateText(line));

  return (
    <div className="content-area" data-testid="teletext-content-area">
      {processedLines.map((line, rowIndex) => {
        // Row index in content area (0-22) maps to grid rows 2-24
        const gridRow = rowIndex + 2;
        
        // If no color map, render plain line
        if (!content.colors || !content.colors[gridRow]) {
          return (
            <div key={rowIndex} className="content-line">
              {line}
            </div>
          );
        }

        // Apply color styling per character
        const colorMap = content.colors[gridRow];
        const characters = line.split('');
        
        return (
          <div key={rowIndex} className="content-line">
            {characters.map((char, colIndex) => {
              const color = colorMap[colIndex];
              if (color) {
                const hexColor = getTeletextColorHex(color);
                return (
                  <span key={colIndex} style={{ color: hexColor }}>
                    {char}
                  </span>
                );
              }
              return <span key={colIndex}>{char}</span>;
            })}
          </div>
        );
      })}
    </div>
  );
}
