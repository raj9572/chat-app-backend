import { Conversation } from "../model/conversationModel.js"
import { Message } from "../model/messageModel.js"


export const sendMessage = async(req,res) =>{
    try {
        const senderId = req.id
        const receiverId = req.params.id
        const {message} = req.body

        let gotConversation = await Conversation.findOne({
            participants:{$all:[senderId, receiverId]}
        })

        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        })

        if(newMessage){
            gotConversation.messages.push(newMessage._id)
        }

        await gotConversation.save()

        //Todo  implement socket io

        return  res.status(201).json({
            message:"message has been send "
        })

    } catch (error) {
        console.log(error)
    }
}


export const getMessage = async(req,res) =>{
    try {
        const receiverId = req.params.id;
        const senderId = req.id
        const conversation = await Conversation.findOne({
            participants : { $all:[senderId,receiverId]}
        }).populate("messages")

        console.log(conversation)
        return res.status(200).json({message:"message get"})

    } catch (error) {
        console.log(error)
    }
}