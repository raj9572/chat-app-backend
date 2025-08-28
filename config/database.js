import mongoose from "mongoose";

const connectDB = async() =>{
    
mongoose.connect('mongodb://127.0.0.1:27017/chat-app').then(()=>{
    console.log("Database is connected")
}).catch(error => {
    console.log(error)
})

 
}


export default connectDB
