import mongoose from 'mongoose'

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.kzdfn.mongodb.net/Worster?retryWrites=true&w=majority`;

var db;
const connectToServer = (callback) => {
    mongoose.connect(uri);
    db = mongoose.connection;
}

const getDb = () => {
    return db;
}

export { connectToServer, getDb }