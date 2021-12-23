// OVERALL THIS IS SO FAR FOR END-TO-END TESTING
// MAY NEED TO ADD SEPARATE SUITE IF WE IMPLEMENT UNIT TESTING WITH FUNCTIONS

import mongoose from "mongoose" // for mongodb connection
import { app } from "../app.js" // importing server routes
import request from "supertest" // request module for route testing
import { jest } from "@jest/globals" // jest object

// disable console error messages
// will check calls to console.error via 'expect(console.error).toHaveBeenCalled()
beforeAll(() => {
    jest.spyOn(global.console, 'error').mockImplementation(() => {})
})

/************************** GROUP ROUTE TESTS **************************/

describe("Group Routes", () => {

    // testing route with correct and expected inputs for group manipulations
    describe("Correct Inputs", () => {
        let gid
        
        it("POST /groups/group", async () => {
            const res = await request(app)
                .post("/groups/group")
                .send({
                    ownerEmail: "example4@test.com",
                    passcode: "somethingthatwillbehashed",
                    groupMembers: []
                })
                .expect("Content-Type", "application/json; charset=utf-8")
            expect(res.statusCode).toBe(201)
            expect(res.body.groupId).toBeDefined()
            expect(res.body.ownerEmail).toBe("example4@test.com")
            expect(Array.isArray(res.body.groupMembers)).toBe(Array.isArray([]))
            gid = res.body.groupId
        })
        
        it("PATCH /groups/group/<groupId>", async () => {
            const res = await request(app)
                .patch("/groups/group/" + gid)
                .send({
                    memberEmail: "example3@test.com"
                })
                .expect("Content-Type", "application/json; charset=utf-8")
            expect(res.statusCode).toBe(200)
            expect(res.body.groupId).toBeDefined()
            expect(res.body.ownerEmail).toBe("example4@test.com")
            expect(res.body.groupMembers).toContain("example3@test.com")
        })

        it("PATCH /groups/group/<groupId> (duplicate checking)", async () => {
            const res = await request(app)
                .patch("/groups/group/" + gid)
                .send({
                    memberEmail: "example3@test.com"
                })
                .expect("Content-Type", "application/json; charset=utf-8")
            expect(res.statusCode).toBe(200)
            expect(res.body.groupId).toBeDefined()
            expect(res.body.ownerEmail).toBe("example4@test.com")
            expect(res.body.groupMembers).toHaveLength(1)
        })

        it("GET /groups/group", async () => {
            const res = await request(app)
                .get("/groups/group")
            expect(res.statusCode).toBe(200)
            expect(res.body.length).toBeGreaterThanOrEqual(0)
            expect(Array.isArray(res.body)).toBe(Array.isArray([]))
        })
    
        it("GET /groups/group?groupID=<groupId>", async () => {
            const res = await request(app)
                .get("/groups/group?groupID=" + gid)
            expect(res.statusCode).toBe(200)
            expect(res.body.groupId).toBe(gid)
            expect(res.body.ownerEmail).toBe("example4@test.com")
            expect(res.body.groupMembers).toBeDefined()
            expect(res.body.groupMembers).toHaveLength(1)
        })
        
        it("DELETE /groups/group/<groupId>", async () => {
            const res = await request(app)
                .del("/groups/group/" + gid)
                .expect("Content-Type", "text/html; charset=utf-8")
            expect(res.statusCode).toBe(200)
            expect(res.text).toContain("Success deleted")
        })
    })

    // testing routes with incorrect and unexpected inputs for grooup manipulations
    describe("Incorrect Inputs", () => {
        it("POST /groups/group (No ownerEmail)", async () => {
            const res = await request(app)
                .post("/groups/group")
                .send({
                    passcode: "somethingthatwillbehashed",
                    groupMembers: []
                })
                .expect("Content-Type", "text/html; charset=utf-8")
            expect(res.statusCode).toBe(500)
            expect(console.error).toHaveBeenCalled()
            expect(res.text).toContain("ValidationError: Group validation failed: ownerEmail: Path `ownerEmail` is required.")
        })
        
        it("PATCH /groups/group/incorrectID", async () => {
            const res = await request(app)
                .patch("/groups/group/incorrectID")
                .send({
                    memberEmail: "example3@test.com"
                })
                .expect("Content-Type", "text/html; charset=utf-8")
            expect(res.statusCode).toBe(404)
            expect(res.text).toEqual("No group found.")
        })

        it("GET /groups/group?randomquery=blah", async () => {
            const res = await request(app)
                .get("/groups/group?randomquery=blah")
                .expect("Content-Type", "application/json; charset=utf-8")
            expect(res.statusCode).toBe(200)
            expect(res.body.length).toBeGreaterThanOrEqual(0)
            expect(Array.isArray(res.body)).toBe(Array.isArray([]))
        })
    
        it("GET /groups/group?groupID=incorrectID", async () => {
            const res = await request(app)
                .get("/groups/group?groupID=incorrectID")
                .expect("Content-Type", "text/html; charset=utf-8")
            expect(res.statusCode).toBe(404)
            expect(res.text).toEqual("No group found.")
        })
        
        it("DELETE /groups/group/incorrectID", async () => {
            const res = await request(app)
                .del("/groups/group/incorrectID")
                .expect("Content-Type", "text/html; charset=utf-8")
            expect(res.statusCode).toBe(404)
            expect(res.text).toEqual("No group deleted, group not found.")
        })
    })
})

/************************** USER ROUTE TESTS **************************/

describe("User Routes", () => {

    // testing routes with correct and expected inputs for user manipulations
    describe("Correct Inputs", () => {
        let uemail = "example5@test.com"
        
        it("POST /users/user", async () => {
            const res = await request(app)
                .post("/users/user")
                .send({
                    userEmail: uemail,
                    groups: []
                })
                .expect("Content-Type", "application/json; charset=utf-8")
            expect(res.statusCode).toBe(201)
            expect(res.body.userEmail).toBe(uemail)
            expect(res.body.groups).toBeDefined()
            expect(Array.isArray(res.body.groups)).toBe(Array.isArray([]))
        })
        
        it("PATCH /users/user/<userEmail>", async () => {
            const res = await request(app)
                .patch("/users/user/" + uemail)
                .send({
                    groupId: "somegroupID"
                })
                .expect("Content-Type", "application/json; charset=utf-8")
            expect(res.statusCode).toBe(200)
            expect(res.body.userEmail).toBe(uemail)
            expect(res.body.groups).toBeDefined()
            expect(res.body.groups).toContain("somegroupID")
        })

        it("PATCH /users/user/<userEmail> (bad removeFlag)", async () => {
            const res = await request(app)
                .patch("/users/user/" + uemail)
                .send({
                    removeFlag: false, // or anything that isn't true boolean
                    groupId: "somegroupID2"
                })
                .expect("Content-Type", "application/json; charset=utf-8")
            expect(res.statusCode).toBe(200)
            expect(res.body.userEmail).toBe(uemail)
            expect(res.body.groups).toBeDefined()
            expect(res.body.groups).toContain("somegroupID2")
        })

        it("PATCH /users/user/<userEmail> (good removeFlag)", async () => {
            const res = await request(app)
                .patch("/users/user/" + uemail)
                .send({
                    removeFlag: true,
                    groupId: "somegroupID2"
                })
                .expect("Content-Type", "application/json; charset=utf-8")
            expect(res.statusCode).toBe(200)
            expect(res.body.userEmail).toBe(uemail)
            expect(res.body.groups).toBeDefined()
            expect(res.body.groups).not.toContain("somegroupID2")
        })

        it("GET /users/user", async () => {
            const res = await request(app)
                .get("/users/user")
            expect(res.statusCode).toBe(200)
            expect(res.body.length).toBeGreaterThanOrEqual(0)
            expect(Array.isArray(res.body)).toBe(Array.isArray([]))
        })
    
        it("GET /users/user?userEmail=<userEmail>", async () => {
            const res = await request(app)
                .get("/users/user?userEmail=" + uemail)
            expect(res.statusCode).toBe(200)
            expect(res.body.userEmail).toBe(uemail)
            expect(res.body.groups).toBeDefined()
            expect(res.body.groups).toContain("somegroupID")
        })
        
        it("DELETE /users/user/<userEmail>", async () => {
            const res = await request(app)
                .del("/users/user/" + uemail)
                .expect("Content-Type", "text/html; charset=utf-8")
            expect(res.statusCode).toBe(200)
            expect(res.text).toContain("Success deleted")
        })
    })

    // testing routes with incorrect and unexpected inputs for user manipulations
    describe("Incorrect Inputs", () => {
        it("POST /users/user (No userEmail)", async () => {
            const res = await request(app)
                .post("/users/user")
                .send({
                    groups: []
                })
                .expect("Content-Type", "text/html; charset=utf-8")
            expect(res.statusCode).toBe(500)
            expect(console.error).toHaveBeenCalled()
            expect(res.text).toContain("ValidationError: User validation failed: userEmail: Path `userEmail` is required.")
        })

        it("POST /users/user (Nonunique email)", async () => {
            const res = await request(app)
                .post("/users/user")
                .send({
                    userEmail: "example4@test.com",
                    groups: []
                })
                .expect("Content-Type", "text/html; charset=utf-8")
            expect(res.statusCode).toBe(500)
            expect(console.error).toHaveBeenCalled()
            expect(res.text).toContain("MongoServerError: E11000 duplicate key error collection")
        })
        
        it("PATCH /users/user/incorrectEmail", async () => {
            const res = await request(app)
                .patch("/users/user/incorrectEmail")
                .send({
                    groupId: "somegroupId"
                })
                .expect("Content-Type", "text/html; charset=utf-8")
            expect(res.statusCode).toBe(404)
            expect(res.text).toEqual("No user found.")
        })

        it("GET /users/user?randomquery=blah", async () => {
            const res = await request(app)
                .get("/users/user?randomquery=blah")
                .expect("Content-Type", "application/json; charset=utf-8")
            expect(res.statusCode).toBe(200)
            expect(res.body.length).toBeGreaterThanOrEqual(0)
            expect(Array.isArray(res.body)).toBe(Array.isArray([]))
        })
    
        it("GET /users/user?userEmail=incorrectEmail", async () => {
            const res = await request(app)
                .get("/users/user?userEmail=incorrectEmail")
                .expect("Content-Type", "text/html; charset=utf-8")
            expect(res.statusCode).toBe(404)
            expect(res.text).toEqual("No user found.")
        })
        
        it("DELETE /users/user/incorrectEmail", async () => {
            const res = await request(app)
                .del("/users/user/incorrectEmail")
                .expect("Content-Type", "text/html; charset=utf-8")
            expect(res.statusCode).toBe(404)
            expect(res.text).toEqual("No user deleted, user not found.")
        })
    })
})

afterAll(async () => {
    await mongoose.disconnect()
})
