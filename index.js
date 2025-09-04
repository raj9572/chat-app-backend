import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import userRoute from './routes/userRoute.js'
import messageRoute from './routes/messageRoute.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { app,server } from "./socket/socket.js";

// const app = express()

dotenv.config({
    path:"./.env"
})

const port =process.env.PORT || 8080


// middleware 
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cookieParser())

const corsOptions = {
  origin:[process.env.CLIENT_URL ,"http://localhost:5173"],
  credentials:true
}

app.use(cors(corsOptions))


// route 

//! for login the which url request 
// app.use((req, res, next) => {
//   console.log(`[API] ${req.method} ${req.originalUrl}`);
//   next();
// });
app.use("/api/v1/user",userRoute)
app.use("/api/v1/message",messageRoute)

server.listen(port, () => {
  connectDB()
  console.log(`Example app listening on port ${port}`)
})