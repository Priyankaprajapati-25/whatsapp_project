import { useSelector } from "react-redux";
import {
  DotsIcon,
  SearchLargeIcon,
} from "../../../svg";
import { capitalize } from "../../../utils/string";
import { useEffect, useRef, useState } from "react";
import SocketContext from "../../../context/SocketContext";
import Peer from "simple-peer";
import {
  getConversationName,
  getConversationPicture,
} from "../../../utils/chat";

// Solid Video Camera SVG
const SolidVideoIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-4.19-2.79v-7.92l4.19-2.79a.75.75 0 011.185.626v12.25a.75.75 0 01-1.185.626z" />
  </svg>
);

// Solid Phone SVG
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

function ChatHeader({ online, callUser, socket }) {
  const { activeConversation } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);

  return (
    <div className="h-[59px] dark:bg-dark_bg_2 flex items-center p16 select-none">
      {/*Container*/}
      <div className="w-full flex items-center justify-between">
        {/*left*/}
        <div className="flex items-center gap-x-4">
          {/*Conversation image*/}
          <button className="btn">
            <img
              src={
                activeConversation.isGroup
                  ? activeConversation.picture
                  : getConversationPicture(user, activeConversation.users)
              }
              alt=""
              className="w-full h-full rounded-full object-cover"
            />
          </button>
          {/*Conversation name and online status*/}
          <div className="flex flex-col">
            <h1 className="dark:text-white text-md font-bold">
              {activeConversation.isGroup
                ? activeConversation.name
                : capitalize(
                    getConversationName(user, activeConversation.users).split(
                      " "
                    )[0]
                  )}
            </h1>
            <span className="text-xs dark:text-dark_svg_2">
              {!activeConversation.isGroup? (online ? "online" : "offline") : "" }
            </span>
          </div>
        </div>
        {/*Right*/}
        <ul className="flex items-center gap-x-2.5">
          {!activeConversation.isGroup && (
            <>
              <li onClick={() => callUser("video")}>
                <button className="btn">
                  <SolidVideoIcon className="dark:text-dark_svg_1 text-gray-500 w-6 h-6" />
                </button>
              </li>

              <li onClick={() => callUser("audio")}>
                <button className="btn">
                  <SolidPhoneIcon className="dark:text-dark_svg_1 text-gray-500 w-[1.15rem] h-[1.15rem]" />
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}

const ChatHeaderWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <ChatHeader {...props} socket={socket} />}
  </SocketContext.Consumer>
);
export default ChatHeaderWithSocket;