import "dotenv/config"
import express from 'express'
import cors from 'cors'

import { connectToServer } from "./utils/mongoConn.js"

connectToServer((err, client) => {
    if(err) console.log(err)
})

// routes


const app = express()

// port to listen on
const port = 8080

app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.send("Hello World!")
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`) // hosted on 35.222.125.83:8080
})