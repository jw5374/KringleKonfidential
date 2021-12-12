import mongoose from "mongoose"
import express from "express"
import crypto from "crypto"
import { Group } from "../schemas/docSchemas.js"

const groupRouter = express.Router()

groupRouter.post('/group', async (req, res, next) => {
    try {
        let groupId = crypto.randomInt(10000)
        let docObj = req.body
        docObj['groupId'] = groupId.toString()
        docObj['passcode'] = crypto.createHash('sha256').update(docObj.passcode).digest('hex')
        let groupDoc = new Group(docObj)
        let saved = await groupDoc.save()
        res.status(200).send(saved)
    } catch (e) {
        next(e)
    }
})





export default groupRouter
