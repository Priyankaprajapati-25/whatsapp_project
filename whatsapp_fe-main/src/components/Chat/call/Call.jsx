import { useState, useEffect } from "react";
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
  const { receiveingCall, callEnded, name, picture, type } = call;

  const [showActions, setShowActions] = useState(false);
  const [toggle, setToggle] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);

  // ✅ ADDED: Reset mute states whenever the call ends/hides
  useEffect(() => {
    if (!show && !receiveingCall) {
      setIsMuted(false);
      setIsVideoOff(false);
      setIsSpeakerOff(false);
    }
  }, [show, receiveingCall]);

  const toggleMic = () => {
    if (stream && stream.getAudioTracks().length > 0) {
      const audioTrack = stream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (stream && stream.getVideoTracks().length > 0) {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  const toggleSpeaker = () => {
    if (userVideo.current) {
      userVideo.current.muted = !userVideo.current.muted;
      setIsSpeakerOff(userVideo.current.muted);
    }
  };

  return (
    <>
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[550px] z-10 rounded-2xl overflow-hidden callbg
        ${receiveingCall && !callAccepted ? "hidden" : ""}
        `}
        onMouseOver={() => setShowActions(true)}
        onMouseOut={() => setShowActions(false)}
      >
        <div className="w-full h-full">
          <Header />

          <CallArea
            name={name}
            totalSecInCall={totalSecInCall}
            setTotalSecInCall={setTotalSecInCall}
            callAccepted={callAccepted}
          />

          {showActions ? (
            <CallAcions
              endCall={endCall}
              toggleMic={toggleMic}
              toggleVideo={toggleVideo}
              toggleSpeaker={toggleSpeaker}
              isMuted={isMuted}
              isVideoOff={isVideoOff}
              isSpeakerOff={isSpeakerOff}
            />
          ) : null}

          {/* CONDITIONAL RENDER FOR AUDIO/VIDEO UI */}
          {type === "audio" ? (
            <div className="w-full h-full flex flex-col items-center justify-center pt-10">
              <img 
                src={picture || "/default-pic.png"} 
                alt="Profile" 
                className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl"
              />
            </div>
          ) : null}

          {/* VIDEO STREAMS (Hidden if audio call, but kept in DOM to play sound!) */}
          <div className={type === "audio" ? "hidden" : "block"}>
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

      {receiveingCall && !callAccepted && (
        <Ringing
          call={call}
          setCall={setCall}
          answerCall={answerCall}
          endCall={endCall}
        />
      )}

      {!callAccepted && show && (
        <audio src="/audio/ringing.mp3" autoPlay loop />
      )}
    </>
  );
}