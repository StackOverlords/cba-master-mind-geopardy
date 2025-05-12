import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
    name: string;
    user:mongoose.Types.ObjectId;
    description:string;
    isDeleted:boolean
}

const categoryModel = new Schema<ICategory>({
    name:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    description:{
        type:String,
        required:false
    },
    isDeleted:{
        type:Boolean,
        required:false,
        default:false
    }
})

export const CategoryModel = mongoose.model<ICategory>("Category", categoryModel)