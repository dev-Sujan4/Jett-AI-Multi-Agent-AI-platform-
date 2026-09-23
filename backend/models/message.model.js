import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation"
    },
    userId:{
        type:String,
        index:true
    },
    role:{
        type:String,
        enum:["user","assistant"]
    },
    content:String,
    images:[String],
}, { timestamps: true });


const Message = mongoose.model("Message",messageSchema)

export default Message;
