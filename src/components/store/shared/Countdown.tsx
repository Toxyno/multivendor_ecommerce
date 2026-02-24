"use client";
import { useEffect, useState } from "react";

interface CountdownProps {
  targetDate: string;
}
type countdownType = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const Countdown = ({ targetDate }: CountdownProps) => {
  const [timeLeft, settimeLeft] = useState<countdownType>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = async ({ difference }: { difference: number }) => {
    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      settimeLeft({ days, hours, minutes, seconds });
    } else {
      settimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    }
  };

  useEffect(() => {
    const targetTime = new Date(targetDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      if (now >= targetTime) {
        clearInterval(interval);
        settimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        calculateTimeLeft({ difference: targetTime - now });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="text-orange-800 leading-4">
      <div className="inline-block text-xs">
        <span className="mr-1"> Ends in:</span>
        <div className="inline-block">
          <span className="bg-orange-800 text-white min-w-5 p-0 rounded-[2px] inline-block min-h-4 text-center">
            {timeLeft.days.toString().padStart(2, "0")}d
          </span>
          <span className="mx-0.5">:</span>
          <span className="bg-orange-800 text-white min-w-5 p-0 rounded-[2px] inline-block min-h-4 text-center">
            {timeLeft.hours.toString().padStart(2, "0")}h
          </span>
          <span className="mx-0.5">:</span>
          <span className="bg-orange-800 text-white min-w-5 p-0 rounded-[2px] inline-block min-h-4 text-center">
            {timeLeft.minutes.toString().padStart(2, "0")}m
          </span>
          <span className="mx-0.5">:</span>
          <span className="bg-orange-800 text-white min-w-5 p-0 rounded-[2px] inline-block min-h-4 text-center">
            {timeLeft.seconds.toString().padStart(2, "0")}s
          </span>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
