// module imports
import dotenv from "dotenv"
dotenv.config()
import mongoose from "mongoose"
import express from "express"
import cors from "cors"
import * as errFuncs from "./errorHandlers/errorFuncs.js"

// for mongoDB connection
const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.kzdfn.mongodb.net/Worster?retryWrites=true&w=majority`;

// connecting
mongoose.connect(uri)

// routes
import groupRouter from "./routes/groupRouter.js"
import userRouter from "./routes/userRouter.js"

const app = express()

// port to listen on
const port = 8080

app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.send("Hello World!")
})

// routes from the './routes' directory
app.use('/groups', groupRouter)
app.use('/users', userRouter)

// error handlers (using next(error) to pass on errors)
app.use(errFuncs.logErrors)
app.use(errFuncs.clientErrorHandler)
app.use(errFuncs.errorHandler)

// listening on port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`) // hosted on 35.222.125.83:8080
})