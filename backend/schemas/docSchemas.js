import mongoose from "mongoose"

const groupSchema = new mongoose.Schema(
    {
        groupId: String,
        ownerEmail: String,
        passcode: String,
        groupMembers: [String]
    },
    { collection: 'Groups' }
)

const userSchema = new mongoose.Schema(
    {
        userEmail: String,
        groups: Array
    },
    { collection: 'Users' }
)

const User = new mongoose.model("User", userSchema)
const Group = new mongoose.model("Group", groupSchema)

export { Group, User }