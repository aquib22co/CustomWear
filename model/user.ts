import mongoose , {Schema, Document} from "mongoose";

interface IUser extends Document {
    username : string;
    email : string;
    role : string;
    drawing : mongoose.Schema.Types.ObjectId[];
    order : Schema.Types.ObjectId
}

const userSchema = new Schema<IUser>({
    username : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : false,
    },
    role :{ 
        type : String,
        enum : ["user","admin"]
    },
    drawing : [{
        type : Schema.Types.ObjectId,
        ref : "Drawing",
        required : false,
    }],
    order : [{
        type : Schema.Types.ObjectId,
        ref : "Order"
    }],
},{timestamps : true})

export const User = mongoose.model<IUser>("User",userSchema);