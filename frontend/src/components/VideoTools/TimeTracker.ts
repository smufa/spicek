import { useState, useEffect, useRef } from 'react';

export type PlayState = 'playing' | 'paused';

const useTimeManager = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  initialTime = 0,
) => {
  const [time, setTime] = useState(initialTime);
  const [playState, setPlayState] = useState<PlayState>('paused');

  // Store the latest time in a ref to avoid closure issues
  const timeRef = useRef(initialTime);

  // Track if component is mounted
  const isMounted = useRef(true);

  useEffect(() => {
    // Set mounted status
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial time
    video.currentTime = initialTime / 1000;

    const handleTimeUpdate = () => {
      if (!isMounted.current) return;

      const newTime = Math.floor(video.currentTime * 1000);
      timeRef.current = newTime;
      setTime(newTime);
    };

    const handlePlay = () => {
      if (!isMounted.current) return;
      setPlayState('playing');
    };

    const handlePause = () => {
      if (!isMounted.current) return;
      setPlayState('paused');
    };

    // Clean up any existing listeners first
    video.removeEventListener('timeupdate', handleTimeUpdate);
    video.removeEventListener('play', handlePlay);
    video.removeEventListener('pause', handlePause);

    // Add new listeners
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoRef, initialTime]);

  const play = () => {
    if (videoRef.current) {
      setPlayState('playing');
      videoRef.current
        .play()
        .then(() => {
          if (isMounted.current) {
            setPlayState('playing');
          }
        })
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
      timeRef.current = milliseconds;
      if (isMounted.current) {
        setTime(milliseconds);
      }
    }
  };

  return { time, playState, play, pause, seek, setTime };
};

export default useTimeManager;
