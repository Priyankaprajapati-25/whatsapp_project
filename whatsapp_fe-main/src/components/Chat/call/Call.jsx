import { useState } from "react";
import CallAcions from "./CallAcions";
import CallArea from "./CallArea";
import Header from "./Header";
import Ringing from "./Ringing";

export default function Call({
  call,
  setCall,
  callAccepted,
  myVideo,
  stream,
  userVideo,
  answerCall,
  show,
  endCall,
  totalSecInCall,
  setTotalSecInCall,
}) {
  const { receiveingCall, callEnded, name } = call;

  const [showActions, setShowActions] = useState(false);
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[550px] z-10 rounded-2xl overflow-hidden callbg
        ${receiveingCall && !callAccepted ? "hidden" : ""}
        `}
        onMouseOver={() => setShowActions(true)}
        onMouseOut={() => setShowActions(false)}
      >
        <div>
          <Header />

          <CallArea
            name={name}
            totalSecInCall={totalSecInCall}
            setTotalSecInCall={setTotalSecInCall}
            callAccepted={callAccepted}
          />

          {showActions ? <CallAcions endCall={endCall} /> : null}

          {/* VIDEO STREAMS */}
          <div>
            {/* REMOTE USER VIDEO (UNMUTED ✅) */}
            {callAccepted && !callEnded && (
              <div>
                <video
                  ref={userVideo}
                  playsInline
                  autoPlay
                  className={toggle ? "SmallVideoCall" : "largeVideoCall"}
                  onClick={() => setToggle((prev) => !prev)}
                />
              </div>
            )}

            {/* MY VIDEO (MUTED ✅) */}
            {stream && (
              <div>
                <video
                  ref={myVideo}
                  playsInline
                  muted
                  autoPlay
                  className={`${toggle ? "largeVideoCall" : "SmallVideoCall"} ${
                    showActions ? "moveVideoCall" : ""
                  }`}
                  onClick={() => setToggle((prev) => !prev)}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RINGING SCREEN */}
      {receiveingCall && !callAccepted && (
        <Ringing
          call={call}
          setCall={setCall}
          answerCall={answerCall}
          endCall={endCall}
        />
      )}

      {/* CALLING SOUND */}
      {!callAccepted && show && (
        <audio src="/audio/ringing.mp3" autoPlay loop />
      )}
    </>
  );
}