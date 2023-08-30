import mongoose from 'mongoose'

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set('strictQuery', true);

    if(isConnected) {
        console.log('MongoDB is already connected')
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI || '', {
            dbName: 'patient_manager_db',
        })

        isConnected = true;
        console.log("mongo DB Connected")
    } catch (error) {
        console.log("Failed to connect Mongo DB", error)
    }
}