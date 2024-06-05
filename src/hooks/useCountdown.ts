import { useState, useEffect } from "react";

const SECOND = 1_000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

export const useCountdown = (deadline: Date, interval = SECOND) => {
  const [timespan, setTimespan] = useState(deadline.getTime() - Date.now());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimespan((_timespan) => _timespan - interval);
    }, interval);

    return () => {
      clearInterval(intervalId);
    };
  }, [interval]);

  useEffect(() => {
    setTimespan(deadline.getTime() - Date.now());
  }, [deadline]);

  return {
    days: Math.floor(timespan / DAY).toString().padStart(2, "0"),
    hours: Math.floor((timespan / HOUR) % 24).toString().padStart(2, "0"),
    minutes: Math.floor((timespan / MINUTE) % 60).toString().padStart(2, "0"),
    seconds: Math.floor((timespan / SECOND) % 60).toString().padStart(2, "0"),
  };
}