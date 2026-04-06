import {
  ArrowIcon,
  DialIcon,
  MuteIcon,
  SpeakerIcon,
  VideoDialIcon,
} from "../../../svg";

export default function CallAcions({
  endCall,
  toggleMic,
  toggleVideo,
  toggleSpeaker,
  isMuted,
  isVideoOff,
  isSpeakerOff,
}) {
  return (
    <div className="h-22 w-full absolute bottom-0 z-40 px-1">
      {/*Container*/}
      <div className="relative bg-[#222] px-4 pt-6 pb-12 rounded-xl">
        {/*Expand icon*/}
        <button className="-rotate-90 scale-y-[300%] absolute top-1 left-1/2">
          <ArrowIcon className="fill-dark_svg_2" />
        </button>
        {/*Actions*/}
        <ul className="flex items-center justify-between">
          <li onClick={toggleSpeaker}>
            <button
              className={`btn_secondary ${isSpeakerOff ? "bg-red-600" : ""}`}
            >
              <SpeakerIcon className="fill-white w-6" />
            </button>
          </li>
          <li onClick={toggleVideo}>
            <button
              className={`btn_secondary ${isVideoOff ? "bg-red-600" : ""}`}
            >
              <VideoDialIcon className="fill-white w-14 mt-2.5" />
            </button>
          </li>
          <li onClick={toggleMic}>
            <button
              className={`btn_secondary ${isMuted ? "bg-red-600" : ""}`}
            >
              <MuteIcon className="fill-white w-5" />
            </button>
          </li>
          <li onClick={() => endCall()}>
            <button className="btn_secondary bg-red-600 rotate-[135deg]">
              <DialIcon className="fill-white w-6" />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}