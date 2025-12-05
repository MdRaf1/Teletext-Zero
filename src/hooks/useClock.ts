import { useState, useEffect } from 'react';

/**
 * Custom hook that provides real-time clock updates
 * Returns the current Date object, updating every second
 * 
 * @returns {Date} Current date and time, updated every 1000ms
 */
export function useClock(): Date {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    // Set up interval to update time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clean up interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return currentTime;
}
