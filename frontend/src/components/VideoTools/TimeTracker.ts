import { useState, useEffect, useRef } from 'react';

export type PlayState = 'playing' | 'paused';

const useTimeManager = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  initialTime = 0,
) => {
  const [time, setTime] = useState(initialTime);
  const [playState, setPlayState] = useState<PlayState>('paused');

  // Use a ref to track if event listeners are attached
  const listenersAttached = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial time
    video.currentTime = initialTime / 1000;

    // Only attach listeners once
    if (!listenersAttached.current) {
      const handleTimeUpdate = () => {
        setTime(Math.floor(video.currentTime * 1000));
      };

      const handlePlay = () => setPlayState('playing');
      const handlePause = () => setPlayState('paused');

      video.addEventListener('timeupdate', handleTimeUpdate);
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      listenersAttached.current = true;

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        listenersAttached.current = false;
      };
    }
  }, [videoRef, initialTime]);

  const play = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => setPlayState('playing'))
        .catch((err) => console.error('Error playing video:', err));
    }
  };

  const pause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setPlayState('paused');
    }
  };

  const seek = (milliseconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = milliseconds / 1000;
      setTime(milliseconds); // Update time state immediately
    }
  };

  return { time, playState, play, pause, seek };
};

export default useTimeManager;
