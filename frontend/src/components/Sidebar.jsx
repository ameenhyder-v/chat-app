import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";

function formatChatTime(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) return d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const isYesterday = new Date(now - 864e5).toDateString() === d.toDateString();
  if (isYesterday) return "Yesterday";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading, lastMessageAtByUser } =
    useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((u) => onlineUsers.includes(u._id))
    : users;
  const searchFiltered = search.trim()
    ? filteredUsers.filter((u) =>
        u.fullName?.toLowerCase().includes(search.trim().toLowerCase())
      )
    : filteredUsers;
  const sortedUsers =
    Object.keys(lastMessageAtByUser).length === 0
      ? searchFiltered
      : [...searchFiltered].sort((a, b) => {
          const timeA = lastMessageAtByUser[a._id] ?? 0;
          const timeB = lastMessageAtByUser[b._id] ?? 0;
          return timeB - timeA;
        });

  if (isUsersLoading) return <SidebarSkeleton />;
  return (
    <aside className="w-full h-full flex flex-col min-h-0 border-r border-border bg-card text-card-foreground overflow-hidden">
      {/* Search + filters: fixed at top, never scrolls */}
      <div className="p-2 sm:p-3 bg-muted/50 border-b border-border shrink-0 flex-none text-card-foreground">
        <div className="flex items-center gap-2 rounded-lg bg-background pl-3 pr-2 py-2">
          <Search className="size-5 text-muted-foreground shrink-0" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-1.5 text-muted-foreground hover:text-card-foreground text-xs">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox h-3.5 w-3.5"
            />
            <span>Online only</span>
          </label>
          <span className="text-muted-foreground text-xs">
            {Math.max(0, onlineUsers.length - 1)} online
          </span>
        </div>
      </div>

      {/* Contact list: only this section scrolls */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
        {sortedUsers.map((user) => {
          const isSelected = selectedUser?._id === user._id;
          const isOnline = onlineUsers.includes(user._id);
          const lastTime = lastMessageAtByUser[user._id];
          const preview = user.lastMessage
            ? user.lastMessage.image && !user.lastMessage.text
              ? "Photo"
              : (user.lastMessage.text || "Photo").slice(0, 40) + ((user.lastMessage.text?.length || 0) > 40 ? "…" : "")
            : "No messages yet";
          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 sm:py-3 text-left border-b border-border/50
                transition-colors
                ${isSelected ? "bg-accent text-accent-foreground" : "text-card-foreground hover:bg-muted/70 active:bg-muted"}
              `}
            >
              <div className="relative shrink-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 sm:size-14 rounded-full object-cover"
                />
                {isOnline && (
                  <span
                    className="absolute bottom-0 right-0 size-3.5 bg-emerald-500 rounded-full border-2 border-card"
                    title="Online"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className={`font-medium text-sm truncate ${isSelected ? "text-accent-foreground" : "text-card-foreground"}`}>
                    {user.fullName}
                  </span>
                  {lastTime ? (
                    <span className={`text-[11px] sm:text-xs shrink-0 ${isSelected ? "text-accent-foreground/80" : "text-muted-foreground"}`}>
                      {formatChatTime(lastTime)}
                    </span>
                  ) : null}
                </div>
                <p className={`text-xs truncate mt-0.5 ${isSelected ? "text-accent-foreground/80" : "text-muted-foreground"}`}>{preview}</p>
              </div>
            </button>
          );
        })}
        {sortedUsers.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8 px-4">
            {search.trim() ? "No chats match your search." : "No chats yet."}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
