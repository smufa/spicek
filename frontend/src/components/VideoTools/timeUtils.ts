export const formatTime = (milliseconds: number): string => {
  const totalSeconds = milliseconds / 1000;

  if (totalSeconds < 60) {
    return totalSeconds.toFixed(2).padStart(5, '0'); // e.g., "09.87"
  } else {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`; // e.g., "2:05"
  }
};
