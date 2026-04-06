import { useState } from "react";
import { PlusIcon, ReturnIcon } from "../../../../svg";
import UnderlineInput from "./UnderlineInput";
import MultipleSelect from "./MultipleSelect";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";
import { createGroupConversation } from "../../../../features/chatSlice";
import SocketContext from "../../../../context/SocketContext";

function CreateGroup({ setShowCreateGroup, socket }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { status } = useSelector((state) => state.chat);

  const [name, setName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // 🔍 Search users
  const handleSearch = async (e) => {
    if (e.target.value) {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_ENDPOINT}/user?search=${e.target.value}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        const results = data.map((u) => ({
          value: u._id,
          label: u.name,
          picture: u.picture,
        }));

        setSearchResults(results);
      } catch (error) {
        console.log(error.response?.data?.error?.message);
      }
    } else {
      setSearchResults([]);
    }
  };

  // ✅ Create group
  const createGroupHandler = async () => {
    if (!name.trim() || selectedUsers.length === 0) return;

    if (status !== "loading") {
      const users = selectedUsers.map((u) => u.value);

      const values = {
        name,
        users,
        token: user.token,
      };

      try {
        const convo = await dispatch(
          createGroupConversation(values)
        ).unwrap();

        socket.emit("new conversation", convo);
        socket.emit("join conversation", convo._id);

        setShowCreateGroup(false);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="createGroupAnimation relative w-full h-full flex flex-col z-40">
      
      {/* 🔹 CONTENT */}
      <div className="mt-5 px-3 pb-24 flex-1 overflow-y-auto">
        
        {/* Back Button */}
        <button
          className="btn w-6 h-6 border"
          onClick={() => setShowCreateGroup(false)}
        >
          <ReturnIcon className="fill-white" />
        </button>

        {/* Group Name */}
        <UnderlineInput name={name} setName={setName} />

        {/* Users Select */}
        <MultipleSelect
          selectedUsers={selectedUsers}
          searchResults={searchResults}
          setSelectedUsers={setSelectedUsers}
          handleSearch={handleSearch}
        />
      </div>

      {/* 🔥 FLOATING BUTTON (PERFECTLY POSITIONED) */}
      <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-[999]">
        <button
          onClick={createGroupHandler}
          className="group flex items-center justify-center
          w-14 h-14 rounded-full bg-green-500
          hover:bg-green-600 shadow-lg hover:shadow-xl
          transition-all duration-200 active:scale-95"
        >
          {status === "loading" ? (
            <ClipLoader color="#E9EDEF" size={22} />
          ) : (
            <PlusIcon className="fill-white w-6 h-6" />
          )}

          <span
            className="absolute left-16 whitespace-nowrap px-3 py-1 text-sm 
            bg-black text-white rounded-md opacity-0 
            group-hover:opacity-100 transition-all duration-200"
          >
            Create Group
          </span>
        </button>
      </div>
    </div>
  );
}

// 🔌 Socket wrapper
const CreateGroupWithContext = (props) => (
  <SocketContext.Consumer>
    {(socket) => <CreateGroup {...props} socket={socket} />}
  </SocketContext.Consumer>
);

export default CreateGroupWithContext;