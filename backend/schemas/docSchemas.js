import mongoose from "mongoose"

// schema for group member
const memberSchema = new mongoose.Schema(
    {
        memberEmail: {
            type: String,
            required: true
        },
        memberName: String,
        wishlist: String
    },
    { _id: false }
)

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
        groupName: String,
        ownerName: String,
        priceRange: String,
        dateOfExchange: String,
        groupMembers: [memberSchema]
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
        passcode: {
           type: String,
           required: true
        },
        name: String,
        groups: Array
    },
    { collection: 'Users' }
)

// Creating models from the schema
const User = new mongoose.model("User", userSchema)
const Group = new mongoose.model("Group", groupSchema)

// Exporting the models for use elsewhere
export { Group, User }