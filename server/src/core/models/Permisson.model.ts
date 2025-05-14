import mongoose, { Document, Schema } from "mongoose";

export interface IPermission extends Document {
    code: string;
    description: string;
    isDeleted: boolean
}

const permissionyModel = new Schema<IPermission>({
    code: {
        type: String,
        required: true
    }, 
    description: {
        type: String,
        required: false
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false
    }
})

export const PermissionModel = mongoose.model<IPermission>("Permission", permissionyModel)