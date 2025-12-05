import { formatBuffer } from '../utils/formatters';

export interface PageBufferProps {
  buffer: string;
  visible: boolean;
}

/**
 * PageBuffer component - displays the navigation buffer overlay
 * Shows the current page number being typed with dot notation
 * Example: "1..", "10.", "123"
 */
export function PageBuffer({ buffer, visible }: PageBufferProps) {
  if (!visible) {
    return null;
  }

  const formattedBuffer = formatBuffer(buffer);

  // Don't render anything if buffer is empty
  if (formattedBuffer === '') {
    return null;
  }

  return (
    <div className="page-buffer" data-testid="page-buffer">
      {formattedBuffer}
    </div>
  );
}
