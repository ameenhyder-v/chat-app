import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoadings: false,
    isMessagesLoading: false,
    /** userId -> timestamp (ms). Used to sort sidebar by latest message. */
    lastMessageAtByUser: {},

    getUsers: async () => {
        set({ isUsersLoadings: true })
        try {
            const res = await axiosInstance.get("/messages/users");
            console.log(res);
            set({ users: res.data });
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoadings: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            const messages = Array.isArray(res.data) ? res.data : [];
            const lastMessageAtByUser = { ...get().lastMessageAtByUser };
            if (messages.length > 0) {
                const latest = messages.reduce((a, m) =>
                    (new Date(m.createdAt) > new Date(a.createdAt) ? m : a)
                );
                lastMessageAtByUser[userId] = new Date(latest.createdAt).getTime();
            }
            set({ messages, lastMessageAtByUser });
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to fetch messages");
            set({ messages: [] });
        } finally {
            set({ isMessagesLoading: false });
        }
    },
      

    sendMessage: async (messageData) => {
        const { selectedUser, messages, lastMessageAtByUser, users } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            const ts = res.data?.createdAt ? new Date(res.data.createdAt).getTime() : Date.now();
            const lastMessage = {
                text: messageData.text || null,
                image: messageData.image || res.data?.image || null,
                createdAt: res.data?.createdAt,
            };
            const usersUpdated = users.map((u) =>
                u._id === selectedUser._id ? { ...u, lastMessage } : u
            );
            set({
                messages: [...messages, res.data],
                lastMessageAtByUser: { ...lastMessageAtByUser, [selectedUser._id]: ts },
                users: usersUpdated,
            });
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();

        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            const ts = newMessage.createdAt ? new Date(newMessage.createdAt).getTime() : Date.now();
            const { messages, lastMessageAtByUser, selectedUser, users } = get();
            const updatedLast = { ...lastMessageAtByUser, [newMessage.senderId]: ts };
            const lastMessage = {
                text: newMessage.text || null,
                image: newMessage.image || null,
                createdAt: newMessage.createdAt,
            };
            const usersUpdated = users.map((u) =>
                u._id === newMessage.senderId ? { ...u, lastMessage } : u
            );
            if (newMessage.senderId === selectedUser?._id) {
                set({
                    messages: [...messages, newMessage],
                    lastMessageAtByUser: updatedLast,
                    users: usersUpdated,
                });
            } else {
                set({ lastMessageAtByUser: updatedLast, users: usersUpdated });
            }
        });

    },


    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));