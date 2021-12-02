import mongoose from "mongoose"

const groupSchema = new mongoose.Schema(
    {
        _id: mongoose.ObjectId,
        groupId: String,
        ownerEmail: String,
        passcode: String,
        groupMembers: {
            type: Map,
            of: String
        }
    },
    { collection: 'Groups' }
)

export { groupSchema }