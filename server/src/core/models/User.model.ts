import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  name: string;
  role: "user" | "admin";
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: (props: any) => `${props.value} is not a valid email!`,
    },
  },
  name: {
    type: String,
    trim: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  isDeleted: {
    type: Boolean, 
    default: false,
  }
},
  {
    timestamps: true,
    versionKey: false,
  }
);

export const UserModel = mongoose.model<IUser>("User", userSchema);
