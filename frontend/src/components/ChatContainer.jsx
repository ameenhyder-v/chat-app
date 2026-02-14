import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formateMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } =
    useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser?._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages?.length) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-card">
        <ChatHeader />
        <div className="chat-area-bg flex-1 min-h-0">
          <MessageSkeleton />
        </div>
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 overflow-hidden bg-card">
      <ChatHeader />
      <div className="chat-area-bg flex-1 overflow-y-auto min-h-0 px-2 sm:px-4 py-3 sm:py-4">
        <div className="max-w-3xl mx-auto flex flex-col gap-y-1.5">
          {messages?.map((message) => {
            const isOwn = message.senderId === authUser._id;
            return (
              <div
                key={message._id}
                className={`flex w-full ${isOwn ? "justify-end" : "justify-start"}`}
                ref={messageEndRef}
              >
                <div className={`chat w-full max-w-[85%] ${isOwn ? "chat-end" : "chat-start"}`}>
                  <div className={`chat-bubble ${isOwn ? "chat-bubble-primary" : ""} flex flex-col gap-1`}>
                    {message.text && (
                      <p className="text-sm break-words whitespace-pre-wrap leading-relaxed">{message.text}</p>
                    )}
                    {message.image && (
                      <img
                        src={message.image}
                        alt=""
                        className="max-w-[240px] sm:max-w-xs rounded-lg block shadow-sm"
                      />
                    )}
                    <span className={`block text-[11px] mt-0.5 ${isOwn ? "text-primary-foreground/80" : "text-muted-foreground"} text-right leading-none`}>
                      {formateMessageTime(message.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <MessageInput />
    </div>
  );
};

export default ChatContainer;
