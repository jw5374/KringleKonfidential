import mongoose from "mongoose"

// This is the Schema for a group.
const groupSchema = new mongoose.Schema(
    {
        groupId: String,
        ownerEmail: String,
        passcode: String,
        groupMembers: [String]
    },
    { collection: 'Groups' }
)

// Schema for a user
const userSchema = new mongoose.Schema(
    {
        userEmail: String,
        groups: Array
    },
    { collection: 'Users' }
)

// Creating models from the schema
const User = new mongoose.model("User", userSchema)
const Group = new mongoose.model("Group", groupSchema)

// Exporting the models for use elsewhere
export { Group, User }