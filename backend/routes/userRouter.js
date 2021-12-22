import mongoose from "mongoose"
import express from "express"
import { User } from "../schemas/docSchemas.js"

const userRouter = express.Router()

// creates a user in database
userRouter.post('/user', async (req, res, next) => {
    try {
        let userDoc = new User(req.body)
        let saved = await userDoc.save()
        res.status(201).send(saved)
    } catch (e) {
        next(e)
    }
})

// finds user from email and adds a groupId to group list (groups they have created)
userRouter.patch('/user/:userEmail', async (req, res, next) => {
    try {
        let updateDoc = await User.findOne({ "userEmail": req.params.userEmail })
        if(!updateDoc) {
            res.status(404).send("No user found.")
        } else {
            updateDoc.groups.push(req.body.groupId)
            let updated = await updateDoc.save()
            res.status(200).send(updated)
        }
    } catch (e) {
        next(e)
    }
})

// get all users
userRouter.get('/user', async (req, res, next) => {
    if(req.query.userEmail) {
        next()
    } else {
        try {
            let userDoc = await User.find()
            if(!userDoc) {
                res.status(404).send("No users.")
            } else {
                res.status(200).send(userDoc)
            }
        } catch (e) {
            next(e)
        }
    }
})

// finds and returns user based on their email
userRouter.get('/user', async (req, res, next) => {
    try {
        let userDoc = await User.findOne({ "userEmail": req.query.userEmail })
        if(!userDoc) {
            res.status(404).send("No user found.")
        } else {
            res.status(200).send(userDoc)
        }
    } catch (e) {
        next(e)
    }
})

// deletes a user based on their email
userRouter.delete('/user/:userEmail', async (req, res, next) => {
    try {
        let removedDoc = await User.deleteOne({ "userEmail": req.params.userEmail })
        if(removedDoc.deletedCount) {
            res.status(200).send("Success deleted:\n" + JSON.stringify(removedDoc))
        } else {
            res.status(404).send("No user deleted, user not found.")
        }
    } catch (e) {
        next(e)
    }
})

export default userRouter
