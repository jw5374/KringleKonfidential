import express from "express"
import { User } from "../schemas/docSchemas.js"
import generalFuncs from "../utils/genOps.js"

const userRouter = express.Router()

// creates a user in database
userRouter.post('/user', async (req, res, next) => {
    try {
        let docObj = req.body
        if(docObj.passcode) {
            docObj['passcode'] = generalFuncs.hashPass(docObj.passcode)
        }
        let userDoc = new User(docObj)
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
            if(req.body.removeFlag == true) {
                res.locals.updateDoc = updateDoc
                next()
            } else {
                updateDoc.groups.push(req.body.groupId)
                let updated = await updateDoc.save()
                res.status(200).send(updated)
            }
        }
    } catch (e) {
        next(e)
    }
})

// removes group from user.
userRouter.patch('/user/:userEmail', async (req, res, next) => {
    try {
        let passedUpdateDoc = res.locals.updateDoc
        let index = passedUpdateDoc.groups.indexOf(req.body.groupId)
        if(index != -1) {
            passedUpdateDoc.groups.splice(index, 1)
            let updated = await passedUpdateDoc.save()
            res.status(200).send(updated)
        } else {
            res.status(404).send("Incorrect groupId or groupId not found.")
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
