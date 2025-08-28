import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import router from './routes/userRoute.js'
import cookieParser from 'cookie-parser'

dotenv.config({
    path:"./.env"
})

const app = express()
const port =process.env.PORT || 3000


// middleware 
app.use(express.json())
app.use(cookieParser())



// route 
app.use("/api/v1/user",router)

app.listen(port, () => {
  connectDB()
  console.log(`Example app listening on port ${port}`)
})