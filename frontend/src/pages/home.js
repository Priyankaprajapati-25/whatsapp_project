import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Peer from "simple-peer";
import ChatContainer from "../components/Chat/ChatContainer.jsx";
import WhatsappHome from "../components/Chat/Welcome/WhatsappHome.jsx";
import { Sidebar } from "../components/sidebar/index.js";
import SocketContext from "../context/SocketContext.js";
import {
  getConversations,
  updateMessagesAndConversations,
} from "../features/chatSlice.js";
import Call from "../components/Chat/call/Call.jsx";
import { getConversationId } from "../utils/chat.js";

const initialCallState = {
  receiveingCall: false,
  callEnded: false,
  name: "",
  picture: "",
  signal: "",
  remoteSocketId: "", 
  type: "video",
};

function Home({ socket }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activeConversation } = useSelector((state) => state.chat);
  
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [call, setCall] = useState(initialCallState);
  const [stream, setStream] = useState(null);
  const [show, setShow] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [totalSecInCall, setTotalSecInCall] = useState(0);
  const [typing, setTyping] = useState(false);

  const myVideo = useRef();
  const userVideo = useRef();
  
  const connectionRef = useRef(null);
  const streamRef = useRef(null);
  const isCallActiveRef = useRef(false);
  const callRef = useRef(initialCallState);

  useEffect(() => {
    callRef.current = call;
  }, [call]);

  const cleanupCall = useCallback(() => {
    isCallActiveRef.current = false;
    callRef.current = initialCallState; 
    if (connectionRef.current) {
      try { connectionRef.current.destroy(); } catch (_) {}
      connectionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (myVideo.current) myVideo.current.srcObject = null;
    if (userVideo.current) userVideo.current.srcObject = null;

    setStream(null);
    setShow(false);
    setCallAccepted(false);
    setTotalSecInCall(0);
    setCall(initialCallState);
  }, []);

  useEffect(() => {
    socket.emit("join", user._id);
    socket.on("get-online-users", (users) => setOnlineUsers(users));

    socket.on("call user", (data) => {
      if (isCallActiveRef.current) return;
      setCall({
        receiveingCall: true,
        remoteSocketId: data.from, 
        name: data.name,
        picture: data.picture,
        signal: data.signal,
        type: data.type || "video",
        callEnded: false,
      });
      setShow(true);
    });

    socket.on("end call", () => cleanupCall());

    return () => {
      socket.off("get-online-users");
      socket.off("call user");
      socket.off("end call");
    };
  }, [user._id, socket, cleanupCall]);

  useEffect(() => {
    const handleCallAccepted = (signal) => {
      setCallAccepted(true);
      if (connectionRef.current) {
        connectionRef.current.signal(signal);
      }
    };
    socket.on("call accepted", handleCallAccepted);
    return () => socket.off("call accepted", handleCallAccepted);
  }, [socket]);

  const setupMedia = async (callType) => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: callType === "video", 
        audio: true,
      });
      streamRef.current = newStream;
      setStream(newStream);
      return newStream;
    } catch (err) {
      console.error("Failed to get media", err);
      return null;
    }
  };

  const attachMyVideo = (mediaStream) => {
    const attach = (retries = 0) => {
      if (myVideo.current) {
        myVideo.current.srcObject = mediaStream;
        myVideo.current.play().catch(() => {});
      } else if (retries < 15) {
        setTimeout(() => attach(retries + 1), 100);
      }
    };
    attach();
  };

  const attachRemoteVideo = (remoteStream) => {
    const attach = (retries = 0) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
        userVideo.current.play().catch(() => {});
      } else if (retries < 15) {
        setTimeout(() => attach(retries + 1), 100);
      }
    };
    attach();
  };

  const getPeerConfig = () => ({
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  });

  const callUser = async (callType = "video") => {
    if (isCallActiveRef.current) return;
    isCallActiveRef.current = true;

    const currentStream = await setupMedia(callType);
    if (!currentStream) {
      isCallActiveRef.current = false;
      return;
    }

    const remoteUser = activeConversation.users.find(u => u._id !== user._id);
    setCall((prev) => ({
      ...prev,
      name: remoteUser?.name || "Unknown",
      picture: remoteUser?.picture || "",
      type: callType,
    }));

    setShow(true); 
    attachMyVideo(currentStream);

    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: currentStream,
      config: getPeerConfig(),
    });

    peer.on("signal", (data) => {
      socket.emit("call user", {
        userToCall: getConversationId(user, activeConversation.users),
        signal: data,
        from: socket.id, 
        name: user.name,
        picture: user.picture,
        type: callType,
      });
    });

    peer.on("stream", attachRemoteVideo);
    peer.on("error", (err) => cleanupCall());
    peer.on("close", () => cleanupCall());

    connectionRef.current = peer;
  };

  const answerCall = async () => {
    if (isCallActiveRef.current) return;
    isCallActiveRef.current = true;

    const currentStream = await setupMedia(callRef.current.type); 
    if (!currentStream) {
      isCallActiveRef.current = false;
      return;
    }

    setCallAccepted(true);
    attachMyVideo(currentStream);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: currentStream,
      config: getPeerConfig(),
    });

    peer.on("signal", (data) => {
      socket.emit("answer call", {
        signal: data,
        to: callRef.current.remoteSocketId, 
      });
    });

    peer.on("stream", attachRemoteVideo);
    peer.on("error", (err) => cleanupCall());
    peer.on("close", () => cleanupCall());

    peer.signal(callRef.current.signal);
    connectionRef.current = peer;
  };

  const endCall = () => {
    isCallActiveRef.current = false;
    let target = callRef.current.remoteSocketId;

    if (!target) {
      const remoteUserId = getConversationId(user, activeConversation.users);
      const remoteUserObj = onlineUsers.find(
        (u) => u.userId === remoteUserId || u._id === remoteUserId
      );
      target = remoteUserObj?.socketId || remoteUserId;
    }

    if (target) {
      socket.emit("end call", target);
    }
    cleanupCall();
  };

  useEffect(() => {
    if (user?.token) dispatch(getConversations(user.token));
  }, [user, dispatch]);

  useEffect(() => {
    socket.on("receive message", (msg) => dispatch(updateMessagesAndConversations(msg)));
    socket.on("typing", (conv) => setTyping(conv));
    socket.on("stop typing", () => setTyping(false));
    return () => {
      socket.off("receive message");
      socket.off("typing");
      socket.off("stop typing");
    };
  }, [socket, dispatch]);

  return (
    <>
      {/* Changed: Removed the inner container and padding so it naturally spans 100vw and 100vh */}
      <div className="h-screen w-full dark:bg-dark_bg_1 flex overflow-hidden">
        
        {/* SIDEBAR WRAPPER: flex-none stops it from squishing */}
        <div 
          className={`h-full w-full md:w-[40%] md:min-w-[420px] md:max-w-[420px] flex-none ${
            activeConversation._id ? "hidden md:flex" : "flex"
          }`}
        >
          <Sidebar onlineUsers={onlineUsers} typing={typing} />
        </div>

        {/* CHAT/HOME WRAPPER: flex-1 ensures it fills the remaining space perfectly */}
        <div 
          className={`h-full w-full flex-1 ${
            !activeConversation._id ? "hidden md:flex" : "flex"
          }`}
        >
          {activeConversation._id ? (
            <ChatContainer onlineUsers={onlineUsers} callUser={callUser} typing={typing} />
          ) : (
            <WhatsappHome />
          )}
        </div>

      </div>

      {/* Call UI */}
      <div className={(show || call.receiveingCall) && !call.callEnded ? "block" : "hidden"}>
        <Call
          call={call}
          setCall={setCall}
          callAccepted={callAccepted}
          myVideo={myVideo}
          userVideo={userVideo}
          stream={stream}
          answerCall={answerCall}
          show={show}
          endCall={endCall}
          totalSecInCall={totalSecInCall}
          setTotalSecInCall={setTotalSecInCall}
        />
      </div>
    </>
  );
}

const HomeWithSocket = (props) => (
  <SocketContext.Consumer>
    {(socket) => <Home {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default HomeWithSocket;