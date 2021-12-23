import { app } from './app.js'

// port to listen on
const port = 8080

// listening on port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`) // hosted on 35.222.125.83:8080
})
