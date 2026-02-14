import React from "react";
import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelectde from "../components/NoChatSelectde";
import ChatContainer from "../components/ChatContainer";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  return (
    <div className="flex w-full h-full min-w-0 bg-background overflow-hidden">
      {/* Sidebar: search fixed on top, contact list scrolls; hidden on mobile when chat open */}
      <div
        className={
          selectedUser
            ? "hidden sm:flex sm:w-80 md:w-96 flex-shrink-0 flex-col h-full min-h-0 overflow-hidden"
            : "flex w-full sm:w-80 md:w-96 flex-shrink-0 flex-col h-full min-h-0 overflow-hidden"
        }
      >
        <Sidebar />
      </div>
      {/* Chat area: always takes remaining space so layout never collapses */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col overflow-hidden">
        {!selectedUser ? <NoChatSelectde /> : <ChatContainer />}
      </div>
    </div>
  );
};

export default HomePage;
