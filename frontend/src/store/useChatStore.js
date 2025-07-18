import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";


export const useChatStore = create((set, get) => ({
    message: [],
    users: [],
    selectedUser: null,
    isUsersLoadings: false,
    isMessagesLoading: false,

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
            console.log(res);
            set({ messages: Array.isArray(res.data) ? res.data : [] }); // ✅ Safe fallback
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Failed to fetch messages");
            set({ messages: [] }); // ✅ Ensure fallback on failure
        } finally {
            set({ isMessagesLoading: false });
        }
    },
      

    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({messages: [...messages, res.data]});
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();

        if (!selectedUser) return;
        const socket = useAuthStore.getState().socket;

        socket.on("newMessage", (newMessage) => {
            if(newMessage.senderId !== selectedUser._id) return;
            set({
                messages: [...get().messages, newMessage],
            });
        });

    },


    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));