import { useState } from "react";
import { Conversations } from "./conversations/index.js";
import { SidebarHeader } from "./header/index.js";
import { Notifications } from "./notifications/index.js";
import { Search } from "./search/index.js";
import { SearchResults } from "./search/index.js";
import CreateChat from "./createchat/CreateChat.jsx";

export default function Sidebar({ onlineUsers, typing }) {
  const [searchResults, setSearchResults] = useState([]);
  const [showCreateChat, setShowCreateChat] = useState(false);

  return (
    <div className="w-full h-full select-none flex flex-col">
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