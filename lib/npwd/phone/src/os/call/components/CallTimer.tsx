import React from 'react';
import useTimer from '../hooks/useTimer';

const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

export const CallTimer = () => {
  const { seconds, hours, minutes } = useTimer();
  return (
      <div className="flex flex-col justify-center items-center text-gray-300">
          <div className="font-light">{`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`}</div>
      </div>
  );
};
