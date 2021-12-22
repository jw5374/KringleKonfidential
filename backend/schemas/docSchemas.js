import mongoose from "mongoose"

// This is the Schema for a group.
const groupSchema = new mongoose.Schema(
    {
        groupId: {
            type: String,
            required: true,
            unique: true
        },
        ownerEmail: {
            type: String,
            required: true
        },
        passcode: String,
        groupMembers: [String]
    },
    { collection: 'Groups' }
)

// Schema for a user
const userSchema = new mongoose.Schema(
    {
        userEmail: {
           type:  String,
           required: true,
           unique: true
        },
        groups: Array
    },
    { collection: 'Users' }
)

// Creating models from the schema
const User = new mongoose.model("User", userSchema)
const Group = new mongoose.model("Group", groupSchema)

// Exporting the models for use elsewhere
export { Group, User }