import express from "express"
import { Group } from "../schemas/docSchemas.js"
import { groupIdGen } from "../utils/genOps.js"
import groupOps from "../utils/groupOps.js"

const groupRouter = express.Router()

// creates a group in database
groupRouter.post('/group', async (req, res, next) => {
    try {
        let groupId = groupIdGen()
        let docObj = req.body
        docObj['groupId'] = groupId
        let groupDoc = new Group(docObj)
        let saved = await groupDoc.save()
        res.status(201).send(saved)
    } catch (e) {
        next(e)
    }
})

// testing email route
groupRouter.post('/group/email', async (req, res, next) => {
    try {
        let response = await groupOps.sendEmail(req.body.matched)
        res.status(response.statusCode).send(response)
    } catch (e) {
        next(e)
    }
})


groupRouter.post('/group/:groupId', async (req, res, next) => {
    try {
        let group = await Group.findOne({ "groupId": req.params.groupId })
        if(!group) {
            res.status(404).send("No group found.")
        } else {
            let details = {
                groupName: group.groupName,
                ownerName: group.ownerName,
                pricing: group.priceRange,
                date: group.dateOfExchange
            }
            let memberMails = group.groupMembers
            groupOps.shuffleMembers(memberMails)
            let matched = groupOps.matchMembers(memberMails)
            let response = await groupOps.sendEmails(matched, details)
            res.status(response[0].statusCode).send(response)
        }
    } catch (e) {
        next(e)
    }
})

// finds group from groupId and adds a member email to member list
groupRouter.patch('/group/:groupID', async (req, res, next) => {
    try {
        let updateDoc = await Group.findOneAndUpdate(
            {
                "groupId": req.params.groupID,
                "groupMembers.memberEmail": { $ne: req.body.memberEmail }
            },
            { 
                $push: { groupMembers: req.body } 
            },
            { 
                returnDocument: "after",
                runValidators: true
            })
        if(!updateDoc) {
            res.status(404).send("No group found, or duplicate member email.")
        } else {
            res.status(200).send(updateDoc) // no feedback when trying to add duplicate
        }
    } catch (e) {
        next(e)
    }
})

//removing user from groups
groupRouter.patch('/group/:groupID/members', async (req, res, next) => {
    try {
        let updateDoc = await Group.findOne({ "groupId": req.params.groupID })
        if(!updateDoc) {
            res.status(404).send("No group found.")
        } else {
            let index = updateDoc.groupMembers.findIndex(member => member.memberEmail === req.body.memberEmail)
            if(index != -1) {
                updateDoc.groupMembers.splice(index, 1)
                let updated = await updateDoc.save()
                res.status(200).send(updated)
            } else {
                res.status(404).send("Incorrect Email or no user in this group.")
            }
        }
        
    } catch (e) {
        next(e)
    }
})

// get all groups
groupRouter.get('/group', async (req, res, next) => {
    if(req.query.groupID) {
        next()
    } else {
        try {
            let groupDoc = await Group.find()
            if(!groupDoc) {
                res.status(404).send("No groups.")
            } else {
                res.status(200).send(groupDoc)
            }
        } catch (e) {
            next(e)
        }
    }
})


// finds and returns a group based on groupId
groupRouter.get('/group', async (req, res, next) => {
    try {
        let groupDoc = await Group.findOne({ "groupId": req.query.groupID })
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
