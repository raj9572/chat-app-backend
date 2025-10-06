import { Server } from 'socket.io'
import http from "http"
import express from "express"



const app = express()

const server = http.createServer(app)


const io = new Server(server, {
    cors: {
        origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
        methods: ['GET', 'POST']
    }
})


export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId]?.socketId || null
}

const userSocketMap = {}  // {userId ---> socketId}

// console.log(userSocketMap)

io.on("connection", (socket) => {
    console.log('user connected ', socket.id)

    const userId = socket.handshake.query.userId

    if (userId !== undefined) {
        userSocketMap[userId] = { socketId: socket.id, lastSeen: null }
    }
    // send the online users to client
    io.emit('getOnlineUsers', userSocketMap)

    socket.on('disconnect', () => {
        console.log('user disconnected ', socket.id)
        if (userSocketMap[userId]) {
            userSocketMap[userId].lastSeen = new Date().toISOString();
            delete userSocketMap[userId].socketId;
        }
        io.emit('getOnlineUsers', userSocketMap)
    })



})



export { app, io, server }