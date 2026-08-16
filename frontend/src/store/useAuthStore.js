import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import {io} from "socket.io-client";


const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:3003/api" : "/";

                        // here we are getting set and get methods from zustand 
                        // set is used to update the state
                        // get is used to get the state 
export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIng: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");

      set({ authUser: res.data });
      get().connectSocket();

    } catch (error) {
      console.log("Error in checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true});
    try {
        const res = await axiosInstance.post("/auth/signup", data);
        set({ authUser: res.data });
        toast.success("Account created successfully");
        get().connectSocket();

    } catch (error) {
        console.log(error)
        toast.error(error.response.data.message);
    } finally {
        set({ isSigningUp: false});
    }
  },

  login: async (data) => {
    set({isLoggingIng: true});
    try {
        const res = await axiosInstance.post("/auth/login", data);
        set({authUser: res.data});
        toast.success("Logged in successfully");

        get().connectSocket();
    } catch (error) {
        toast.error(error.response.data.message);
    } finally {
        set({ isLoggingIng: false });
    }
  },

  logout: async () => {
    try {
        await axiosInstance.post("/auth/logout");
        set({ authUser: null });
        toast.success("Logged out successfully");
        get().disconnectSocket();

    } catch (error) {
        toast.error(error.response.data.message);

    }
  },

  updateProfile: async(data) => {
    set({ isUpdatingProfile: true});
    try {
        const res = await axiosInstance.put("/auth/update-profile", data);
        set({ authUser: res.data });
        toast.success("Profile updated successfully");
    } catch (error) {
        console.log("error in updating profile: ", error);
        toast.error(error.response.data.message);
        
    } finally {
        set({ isUpdatingProfile: false });
    }
  },

  connectSocket: async () => {
    const {authUser} = get();
    if(!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds })
    });

    // Listen for new messages globally to show notifications for other chats
    socket.on("newMessage", async (newMessage) => {
      const { useChatStore } = await import("./useChatStore.js");
      const chatStore = useChatStore.getState();
      const isMessageFromSelectedUser = chatStore.selectedUser?._id === newMessage.senderId;

      if (!isMessageFromSelectedUser) {
        const sender = chatStore.users.find((u) => u._id === newMessage.senderId);
        const senderName = sender ? sender.fullName : "Someone";
        const messageText = newMessage.text || "sent an image";

        toast(`💬 ${senderName} : ${messageText}`, {
          duration: 5000,
          position: "top-center",
        });
      }
    });
  },

  disconnectSocket: async () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
