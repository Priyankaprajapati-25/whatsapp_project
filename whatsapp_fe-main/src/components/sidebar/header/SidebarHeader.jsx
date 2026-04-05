import { useSelector } from "react-redux";
import { PlusIcon, CommunityIcon, DotsIcon, StoryIcon } from "../../../svg";
import { useState } from "react";
import Menu from "./Menu";
import { CreateGroup } from "./createGroup";
import CreateChat from "../createchat"

export default function SidebarHeader({ setShowCreateChat }) {
  const { user } = useSelector((state) => state.user);
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  
  return (
    <>
      {/*Sidebar header*/}
      <div className="h-[50px] dark:bg-dark_bg_2 flex items-center p16">
        {/* container */}
        <div className="w-full flex items-center justify-between">
          {/*user image*/}
          <button className="btn">
            <img
              src={user.picture}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          </button>
          {/*user icons*/}
          <ul className="flex items-center gap-x-2 5">
          <li onClick={() => setShowCreateChat(true)} className="relative group">
            <button
              className="btn border-[0.5px] border-gray-500/50 
              dark:border-white/20 rounded-full 
              transition-all duration-200"
            >
              <PlusIcon className="dark:fill-dark_svg_1 w-7 h-7" />
            </button>
            {/* Tooltip */}
            <span
              className="absolute left-1/2 -translate-x-1/2 top-10 
              opacity-0 group-hover:opacity-100 
              scale-95 group-hover:scale-100
              transition-all duration-200
              bg-gray-800 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap z-50"
            >
              Create new chat
              <span
                className="absolute -top-1 left-1/2 -translate-x-1/2 
                w-2 h-2 bg-gray-800 rotate-45"
              ></span>
            </span>
          </li>
            <li
              className="relative"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <button className={`btn ${showMenu ? "bg-dark_hover_1" : ""}`}>
                <DotsIcon className="dark:fill-dark_svg_1" />
              </button>
              {showMenu ? (
                <Menu setShowCreateGroup={setShowCreateGroup} />
              ) : null}
            </li>
          </ul>
        </div>
      </div>
      {/*Create Group*/}
      {showCreateGroup && (
        <CreateGroup setShowCreateGroup={setShowCreateGroup} />
      )}
    </>
  );
}
