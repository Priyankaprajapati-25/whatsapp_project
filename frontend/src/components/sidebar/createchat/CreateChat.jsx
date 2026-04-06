import { useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { open_create_conversation, addConversation  } from "../../../features/chatSlice";
import SocketContext from "../../../context/SocketContext";

function CreateChat({ setShowCreateChat, socket }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const { user } = useSelector((state) => state.user);
  const { token } = user;

  const dispatch = useDispatch();

  const handleSearch = async () => {
    if (!name.trim()) return;

    try {
      setError("");

      // 🔍 Search user
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_ENDPOINT}/user?search=${name}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //Check if user exists
      if (!data || data.length === 0) {
        setError("User does not exist.");
        return;
      }

      const values = {
        receiver_id: data[0]._id,
        isGroup: false,
        token,
      };

      //Create conversation
      let newConvo = await dispatch(open_create_conversation(values));

      //Check if conversation created
      if (!newConvo?.payload) {
        setError("Failed to create conversation.");
        return;
      }

      dispatch(addConversation(newConvo.payload));

      //Join socket room
      socket.emit("join conversation", newConvo.payload._id);

      //Close modal on success
      setShowCreateChat(false);

    } catch (error) {
      setError(
        error?.response?.data?.error?.message || "Something went wrong"
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Modal Box */}
      <div
        className="bg-dark_bg_2 w-[350px] p-5 rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-lg font-semibold">
            Create New Chat
          </h2>
          <button
            onClick={() => setShowCreateChat(false)}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Enter username..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded-md bg-dark_bg_3 text-white outline-none 
          focus:ring-2 focus:ring-green-500"
        />

        {/* Error Message */}
        {error && (
          <p className="text-red-400 text-sm mt-2">{error}</p>
        )}

        {/* Button */}
        <button
          className="w-full mt-4 bg-green-500 hover:bg-green-600 
          text-white py-2 rounded-md transition"
          onClick={handleSearch}
        >
          Create
        </button>
      </div>
    </div>
  );
}

// 🔌 Wrap with socket context
const CreateChatWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <CreateChat {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default CreateChatWithContext;