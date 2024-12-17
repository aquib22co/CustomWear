import mongoose , {Schema,Document} from "mongoose"

interface IProduct extends Document{
    productId : number;
    productType : string;
    productPic : string;
    ProductPrice : number;
}

interface IOrder extends Document{
    orderId : number;
    products : {
        product : IProduct,
        quantity : number;
    }[];
    totalPrice : number;
    orderStatus : string;
}


const productSchema = new Schema<IProduct>({
    productId : {
        type : Number,
        requried : true,
    },
    productType : {
        type : String,
        required : true,
    },
    productPic : {
        type :String,
        required : true,
    },
    ProductPrice : {
        type : Number,
        requried : true
    }
},{timestamps : true})

const orderSchema = new Schema<IOrder>({
    orderId : {
        type : Number,
        required : true,
    },
    products : [
        {
            product : {
                type : productSchema,
                required: true
            },
            quantity : {
                type : Number,
                required : true
            }
        }
    ],
    totalPrice : {
        type : Number,
        required : true
    },
    orderStatus : {
        type : String,
        enum : ["Pending","Processing","Completed","Cancelled"],
        default : "Pending"
    }
},{timestamps : true});


export const Order = mongoose.model<IOrder>("Order",orderSchema);