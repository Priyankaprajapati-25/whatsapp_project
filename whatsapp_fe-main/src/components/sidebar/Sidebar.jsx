import { useState } from "react";
import { Conversations } from "./conversations";
import { SidebarHeader } from "./header";
import { Notifications } from "./notifications";
import { Search } from "./search";
import { SearchResults } from "./search";
import CreateChat from "./createchat/CreateChat.jsx";

export default function Sidebar({ onlineUsers, typing }) {
  const [searchResults, setSearchResults] = useState([]);
  const [showCreateChat, setShowCreateChat] = useState(false);
  return (
    <div className="flex0030 max-w-[30%] h-full select-none">
      {/*Sidebar Header*/}
      <SidebarHeader setShowCreateChat={setShowCreateChat} />
      {/*Notifications */}
      <Notifications />
      {/*Search*/}
      <Search
        searchLength={searchResults.length}
        setSearchResults={setSearchResults}
      />

      {/*Creating new chat*/}
      {showCreateChat && (
        <CreateChat setShowCreateChat={setShowCreateChat} />
      )}

      {searchResults.length > 0 ? (
        <>
          {/*Search results*/}
          <SearchResults
            searchResults={searchResults}
            setSearchResults={setSearchResults}
          />
        </>
      ) : (
        <>
          {/*Conversations*/}
          <Conversations onlineUsers={onlineUsers} typing={typing} />
        </>
      )}
    </div>
  );
}
