import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        _id: mongoose.ObjectId,
        userEmail: String,
        groups: Array
    },
    { collection: 'Users' }
)

export { userSchema }