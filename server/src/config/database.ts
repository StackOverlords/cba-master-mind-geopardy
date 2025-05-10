import mongoose from "mongoose";

export class DBConnectorMongoose {
    private static instance: DBConnectorMongoose;
    private uri: string;

    private constructor() {
        this.uri = process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";
    }

    public static getInstance(): DBConnectorMongoose {
        if (!DBConnectorMongoose.instance) {
            DBConnectorMongoose.instance = new DBConnectorMongoose();
        }
        return DBConnectorMongoose.instance;
    }

    public async connect(): Promise<void> {
        try {
            await mongoose.connect(this.uri);
            if (process.env.NODE_ENV === 'development') {
                console.log("Connected to MongoDB");
            }
        } catch (error) {
            console.error("Error connecting to MongoDB", error);
            throw error;
        }
    }
}