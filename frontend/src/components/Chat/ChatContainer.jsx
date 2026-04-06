import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConversationMessages } from "../../features/chatSlice";
import { checkOnlineStatus, getConversationId } from "../../utils/chat";
import { ChatActions } from "./actions";
import ChatHeader from "./header/ChatHeader";
import ChatMessages from "./messages/ChatMessages";
import FilesPreview from "./preview/files/FilesPreview";

export default function ChatContainer({ onlineUsers, typing, callUser }) {
  const dispatch = useDispatch();
  const { activeConversation, files } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.user);
  const { token } = user;
  
  const values = {
    token,
    convo_id: activeConversation?._id,
  };

  useEffect(() => {
    if (activeConversation?._id) {
      dispatch(getConversationMessages(values));
    }
  }, [activeConversation]);

  return (
    // Fixed: Ensure the entire container is a column flexbox
    <div className="relative w-full h-full md:border-l border-transparent md:dark:border-l-dark_border_2 select-none overflow-hidden flex flex-col">
      {/*Chat header*/}
      <ChatHeader
        online={
          activeConversation.isGroup
            ? false
            : checkOnlineStatus(onlineUsers, user, activeConversation.users)
        }
        callUser={callUser}
      />
      
      {/* Dynamic Content */}
      {files.length > 0 ? (
        <FilesPreview />
      ) : (
        <>
          {/*Chat messages: Should have flex-1 inside its component to stretch*/}
          <ChatMessages typing={typing} />
          {/* Chat Actions at the bottom */}
          <ChatActions />
        </>
      )}
    </div>
  );
}