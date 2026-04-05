import { useEffect, useRef } from "react";

export default function CallTimes({ totalSecInCall, setTotalSecInCall, callAccepted }) {
  const timerRef = useRef(null);

  useEffect(() => {
    // Clear any existing timer first
    clearInterval(timerRef.current);
    setTotalSecInCall(0); // ✅ Always reset on mount

    if (callAccepted) {
      timerRef.current = setInterval(() => {
        setTotalSecInCall((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      clearInterval(timerRef.current);
    };
  }, [callAccepted]);

  const hours = parseInt(totalSecInCall / 3600);
  const minutes = parseInt((totalSecInCall % 3600) / 60);
  const seconds = totalSecInCall % 60;
  const pad = (n) => n.toString().padStart(2, "0");

  return (
    <div className={`text-dark_text_2 ${totalSecInCall !== 0 ? "block" : "hidden"}`}>
      {hours > 0 && <><span>{pad(hours)}</span><span>:</span></>}
      <span>{pad(minutes)}</span>
      <span>:</span>
      <span>{pad(seconds)}</span>
    </div>
  );
}