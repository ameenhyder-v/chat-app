import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <header className="flex items-center gap-3 px-3 py-2 sm:px-4 sm:py-3 border-b border-border bg-card shrink-0">
      <button
        onClick={() => setSelectedUser(null)}
        className="btn btn-ghost btn-sm btn-circle shrink-0 lg:hidden"
        aria-label="Back to chats"
      >
        <ArrowLeft className="size-5" />
      </button>
      <div className="relative shrink-0">
        <img
          src={selectedUser.profilePic || "/avatar.png"}
          alt={selectedUser.fullName}
          className="size-10 sm:size-11 rounded-full object-cover"
        />
        {isOnline && (
          <span
            className="absolute bottom-0 right-0 size-3 bg-emerald-500 rounded-full border-2 border-card"
            title="Online"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="font-medium text-base truncate">{selectedUser.fullName}</h1>
        <p className={`text-xs truncate ${isOnline ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
          {isOnline ? "online" : "offline"}
        </p>
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <button type="button" className="btn btn-ghost btn-sm btn-circle" aria-label="Voice call">
          <Phone className="size-5 text-muted-foreground" />
        </button>
        <button type="button" className="btn btn-ghost btn-sm btn-circle" aria-label="Video call">
          <Video className="size-5 text-muted-foreground" />
        </button>
        <button type="button" className="btn btn-ghost btn-sm btn-circle" aria-label="Menu">
          <MoreVertical className="size-5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
