import mongoose from "mongoose";

const connectDB = async() =>{
    
mongoose.connect(process.env.MONGO_URI).then((connectionInstant)=>{
     console.log(`/n Mongodb connected !! DB HOST : ${connectionInstant.connection.host}`)
}).catch(error => {
    console.log(error)
    process.exit(1)
})

 
}


export default connectDB
