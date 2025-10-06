import { uploadOnCloudinary } from "../config/cloudinary.js"
import { Conversation } from "../model/conversationModel.js"
import { Message } from "../model/messageModel.js"
import { getReceiverSocketId, io } from "../socket/socket.js"


export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id
        const receiverId = req.params.id
        const {message} = req.body
       

        let image;

        if(req.file){
            image = await uploadOnCloudinary(req.file?.path)
        }


        let gotConversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        if (!gotConversation) {
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        };

        const newMessage = await Message.create({
            senderId, receiverId, message,
            image : image?.url
        })

        if (newMessage) {
            gotConversation.messages.push(newMessage._id)
        }

        await Promise.all([gotConversation.save(), newMessage.save()])


        const receiverSocketId = getReceiverSocketId(receiverId)

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage)
        }

        return res.status(201).json({ newMessage })

    } catch (error) {
        return res.status(500).json({ message: "error while sending the message" })
    }
}


export const getMessage = async (req, res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages")

        // console.log(conversation)
        return res.status(200).json(conversation?.messages)

    } catch (error) {
        return res.status(500).json({ message: "error while getting the messages" })
    }
}