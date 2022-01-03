import crypto from "crypto"

function hashPass(passcode) {
    return crypto.createHash('sha256').update(passcode).digest('hex')
}

function groupIdGen() {
    return crypto.randomBytes(8).toString('base64url')
}

export { hashPass, groupIdGen }