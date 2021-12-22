import mongoose from "mongoose"
import { app, server } from "../server.js"
import request from "supertest"

describe("Group Routes", () => {
    it("GET /groups/group", (done) => {
        request(app)
            .get("/groups/group")
            .expect(200)
            .expect((res) => {
                res.body.length >= 0
            })
            .end((err, res) => {
                if(err) return done(err)
                return done()
            })
            

    })

    it("GET /groups/group?groupID=O4LDgCMY", (done) => {
        request(app)
            .get("/groups/group?groupID=O4LDgCMY")
            .expect(200)
            .expect((res) => {
                res.body.groupID = "O4LDgCMY"
                res.body.ownerEmail != undefined
            })
            .end((err, res) => {
                if(err) return done(err)
                return done()
            })
    })

    afterAll((done) => {
        server.close()
        mongoose.connection.close(true)
        done()
    })
})
