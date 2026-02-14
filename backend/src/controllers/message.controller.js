import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const lastMessageByUser = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: loggedInUserId },
                        { receiverId: loggedInUserId },
                    ],
                },
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$senderId", loggedInUserId] },
                            "$receiverId",
                            "$senderId",
                        ],
                    },
                    lastAt: { $first: "$createdAt" },
                    lastMessage: {
                        $first: {
                            text: "$text",
                            image: "$image",
                            createdAt: "$createdAt",
                        },
                    },
                },
            },
        ]);

        const lastAtMap = new Map();
        const lastMessageMap = new Map();
        for (const doc of lastMessageByUser) {
            const id = doc._id.toString();
            lastAtMap.set(id, new Date(doc.lastAt).getTime());
            lastMessageMap.set(id, doc.lastMessage);
        }

        const users = await User.find({ _id: { $ne: loggedInUserId } })
            .select("-password")
            .lean();

        users.sort((a, b) => {
            const timeA = lastAtMap.get(a._id.toString()) ?? 0;
            const timeB = lastAtMap.get(b._id.toString()) ?? 0;
            return timeB - timeA;
        });

        const usersWithLastMessage = users.map((u) => {
            const lastMessage = lastMessageMap.get(u._id.toString()) || null;
            return { ...u, lastMessage };
        });

        res.status(200).json(usersWithLastMessage);
    } catch (error) {
        console.log("Error in message controller getUserForSidebar:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const senderId = req.user._id;

        const messages = await Message.find({
            $or: [
                {senderId: senderId, receiverId: userToChatId},
                {senderId: userToChatId, receiverId: senderId}
            ]
        });

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error from message cn getMessage: ", error.message);
        res.status(500).json({ error: "Internal server error"});
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessageController:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

