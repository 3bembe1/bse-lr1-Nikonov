import React, { useEffect, useRef, useState } from 'react';
import './FocusTimer.css';

const DEFAULT_SECONDS = 25 * 60;

export default function FocusTimer() {
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    intervalRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    return () => {
      window.clearInterval(intervalRef.current);
    };
  }, []);

  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  const handleStart = () => {
    if (secondsLeft === 0) {
      setSecondsLeft(DEFAULT_SECONDS);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(DEFAULT_SECONDS);
  };

  return (
    <div className="focus-timer">
      <div className="focus-timer__card">
        <h2 className="focus-timer__title">Таймер фокусування</h2>
        <div className="focus-timer__display" aria-live="polite">
          {minutes}:{seconds}
        </div>
        <div className="focus-timer__controls">
          <button
            className="focus-timer__button focus-timer__button--primary"
            type="button"
            onClick={handleStart}
            disabled={isRunning}
          >
            Start
          </button>
          <button
            className="focus-timer__button focus-timer__button--secondary"
            type="button"
            onClick={handlePause}
            disabled={!isRunning}
          >
            Pause
          </button>
          <button
            className="focus-timer__button focus-timer__button--reset"
            type="button"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return <FocusTimer />;
}
