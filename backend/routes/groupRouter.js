import mongoose from "mongoose"
import express from "express"
import crypto from "crypto"
import { Group } from "../schemas/docSchemas.js"

const groupRouter = express.Router()

// creates a group in database
groupRouter.post('/group', async (req, res, next) => {
    try {
        let groupId = crypto.randomBytes(6).toString('base64')
        let docObj = req.body
        docObj['groupId'] = groupId.toString()
        docObj['passcode'] = crypto.createHash('sha256').update(docObj.passcode).digest('hex')
        let groupDoc = new Group(docObj)
        let saved = await groupDoc.save()
        res.status(201).send(saved)
    } catch (e) {
        next(e)
    }
})

// finds group from groupId and adds a member email to member list
groupRouter.patch('/group/:groupID', async (req, res, next) => {
    try {
        let updateDoc = await Group.findOne({ "groupId": req.params.groupID })
        if(updateDoc.length == 0) {
            res.status(404).send("No group found.")
        } else {
            updateDoc.groupMembers.push(req.body.memberEmail)
            let updated = await updateDoc.save()
            res.status(200).send(updated)
        }
    } catch (e) {
        next(e)
    }
})

// finds and returns a group based on groupId
groupRouter.get('/group/:groupID', async (req, res, next) => {
    try {
        let groupDoc = await Group.findOne({ "groupId": req.params.groupID })
        if(!groupDoc) {
            res.status(404).send("No group found.")
        } else {
            res.status(200).send(groupDoc)
        }
    } catch (e) {
        next(e)
    }
})

// deletes a group based on groupId
groupRouter.delete('/group/:groupID', async (req, res, next) => {
    try {
        let removedDoc = await Group.deleteOne({ "groupId": req.params.groupID })
        if(removedDoc.deletedCount) {
            res.status(200).send("Success deleted:\n" + JSON.stringify(removedDoc))
        } else {
            res.status(404).send("No group deleted, group not found.")
        }
    } catch (e) {
        next(e)
    }
})

export default groupRouter
