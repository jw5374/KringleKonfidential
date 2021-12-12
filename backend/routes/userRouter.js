import mongoose from "mongoose"
import express from "express"
import { User } from "../schemas/docSchemas.js"

const userRouter = express.Router()

userRouter.post('/user', async (req, res, next) => {
    try {
        let userDoc = new User(req.body)
        let saved = await userDoc.save()
        res.status(200).send(saved)
    } catch (e) {
        next(e)
    }
})





export default userRouter
