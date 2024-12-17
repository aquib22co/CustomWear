import mongoose, {Schema, Document} from "mongoose";

interface IDrawing extends Document {
    drawing_name :string;
    drawing_on : string;
    drawing_data : string;
    preview_data : string;
    createdAt : Date;
}

const drawingSchema = new Schema<IDrawing>({
    drawing_name : {
        type : String,
        default : 'CustomWear',
        required : false,
    },
    drawing_on :{
        type : String,
        requried : true
    },
    drawing_data : {
        type : String,
        required : true
    },
    preview_data : {
        type : String,
        required : true
    },
    createdAt :{
        type : Date,
        required : true,
        default : Date.now
    }
    
},{timestamps : true});

export const Drawing = mongoose.model<IDrawing>("Drawing",drawingSchema);