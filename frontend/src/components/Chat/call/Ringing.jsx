import { useEffect, useRef, useState } from "react";
import { CloseIcon, ValidIcon } from "../../../svg";

export default function Ringing({ call, setCall, answerCall, endCall }) {
  const { name, picture } = call;
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (timer >= 30) {
      clearInterval(intervalRef.current);
      setCall((prev) => ({ ...prev, receiveingCall: false }));
    }
  }, [timer, setCall]);

  // ✅ Solid Phone SVG Component (so it fills perfectly with white)
  const SolidPhoneIcon = ({ className }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      className={className}
    >
      <path 
        fillRule="evenodd" 
        d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42 .959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" 
        clipRule="evenodd" 
      />
    </svg>
  );

  return (
    <div className="dark:bg-[#202c33] bg-white rounded-2xl fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl z-30 w-[320px] p-8 flex flex-col items-center">
      
      {/* 🔒 Optional Header */}
      <div className="flex items-center justify-center gap-x-2 text-[#8696a0] text-xs mb-6 font-medium">
        <span>🔒 End-to-end Encrypted</span>
      </div>

      {/* Profile Picture */}
      <img
        src={picture || "/default-pic.png"}
        alt="caller profile picture"
        className="w-28 h-28 rounded-full object-cover shadow-lg mb-4 border-2 border-transparent"
      />

      {/* Caller Info */}
      <div className="text-center flex flex-col items-center mb-8">
        <h1 className="dark:text-white text-black text-2xl font-normal mb-1">
          {name}
        </h1>
        <span className="dark:text-[#8696a0] text-gray-500 text-sm">
          {call.type === "audio" ? "WhatsApp audio..." : "WhatsApp video..."}
        </span>
        <span className="dark:text-[#8696a0] text-gray-500 text-sm">
          Ringing.
        </span>
      </div>

      {/* Accept & Decline Buttons */}
      <ul className="flex items-center justify-center gap-x-12 w-full">
        
        {/* Decline Button (Red, Downward Rotated Solid Icon) */}
        <li 
          onClick={endCall} 
          className="flex flex-col items-center gap-y-2 cursor-pointer group"
        >
          <button className="w-14 h-14 flex items-center justify-center rounded-full bg-[#f15c6d] hover:bg-[#e05060] transition-colors shadow-md">
            <SolidPhoneIcon className="text-white w-7 rotate-[135deg]" />
          </button>
          <span className="dark:text-[#8696a0] text-gray-500 text-sm font-medium">Decline</span>
        </li>

        {/* Accept Button (WhatsApp Green, Normal Solid Icon) */}
        <li 
          onClick={answerCall} 
          className="flex flex-col items-center gap-y-2 cursor-pointer group"
        >
          <button className="w-14 h-14 flex items-center justify-center rounded-full bg-[#00a884] hover:bg-[#06cf9c] transition-colors shadow-md animate-bounce">
            <SolidPhoneIcon className="text-white w-7" />
          </button>
          <span className="dark:text-[#8696a0] text-gray-500 text-sm font-medium">Accept</span>
        </li>
      </ul>

      <audio src="/audio/ringtone.mp3" autoPlay loop />
    </div>
  );
}