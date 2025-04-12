import { useState, useEffect } from 'react';

export type PlayState = 'playing' | 'paused';

const useTimeManager = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  initialTime = 0,
) => {
  const [time, setTime] = useState(initialTime);
  const [playState, setPlayState] = useState<PlayState>('paused');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Set initial time
    video.currentTime = initialTime / 1000;

    const handleTimeUpdate = () => {
      setTime(video.currentTime * 1000);
    };

    const handlePlay = () => setPlayState('playing');
    const handlePause = () => setPlayState('paused');

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [videoRef, initialTime]);

  const play = () => videoRef.current?.play();
  const pause = () => videoRef.current?.pause();
  const seek = (milliseconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = milliseconds / 1000;
    }
  };

  return { time, playState, play, pause, seek };
};

export default useTimeManager;
