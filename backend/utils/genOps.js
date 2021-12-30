const generalFuncs = {
    hashPass: function(passcode) {
        return crypto.createHash('sha256').update(passcode).digest('hex')
    },
    groupIdGen: function() {
        return crypto.randomBytes(8).toString('base64url')
    },
    saveDoc: async function(doc) {
        return doc.save()
    },
    findAllDocs: async function(model) {
        return model.find()
    },
    findSingleDoc: async function(model, filter) {
        // findOne
    },
    findUpdate: async function(model, filter) {
        // findOneAndUpdate
    },
    verifyExists: function(condObj, res, errMsg) {
        if(!condObj) {
            res.status(404).send(errMsg)
        } else {
            res.status(200).send(condObj)
        }
    }
}

export default generalFuncs