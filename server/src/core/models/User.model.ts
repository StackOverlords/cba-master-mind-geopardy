import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  firebaseUid: string;
  email: string;
  name: string;
  role: "player" | "admin";
  isDeleted: boolean;
  completedRegister: boolean;
  permissions: object,
  createdAt: Date;
  updatedAt: Date;
}

const permission = {
  type: String
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
    // Se podran crear 2 tipos de roles
    enum: ["player", "admin"],
    default: "player",
  },
  permissions: [{
    type: Schema.Types.ObjectId,
    ref: "Permission",
    default: []
  }],
  isDeleted: {
    type: Boolean,
    default: false,
    required: false
  },
  completedRegister: {
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
