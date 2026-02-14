import { MessageCircle } from "lucide-react";

const NoChatSelected = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 chat-area-bg">
      <div className="max-w-sm text-center space-y-4">
        <div className="flex justify-center">
          <div className="size-20 rounded-full bg-card border border-border flex items-center justify-center shadow-sm">
            <MessageCircle className="size-10 text-muted-foreground" strokeWidth={1.5} />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-medium text-foreground">Keep your phone connected</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Chatty connects to your chats. Select a chat from the list to start messaging.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
