import sendgridMailer from "@sendgrid/mail"
import dotenv from "dotenv"
dotenv.config()
sendgridMailer.setApiKey(process.env.SENDGRID_API_KEY)
const mailDetails = {
    senderEmail: "jw7355608@gmail.com",
    subject: "Pssst. You're gonna be a Santa! Don't tell anyone."
}

const groupFuncs = {
    shuffleMembers: function(groupArray) {
        if(groupArray.length <= 1) {
            return
        }
        let swapIndex, min
        let max = groupArray.length
        for(let i = 0; i < groupArray.length - 1; i++) {
            min = i+1
            swapIndex = Math.floor(Math.random() * (max - min) + min)
            let temp = groupArray[i]
            groupArray[i] = groupArray[swapIndex]
            groupArray[swapIndex] = temp
        }
    },
    matchMembers: function(shuffledArray) {
        let matchMatrix = []
        matchMatrix.push([shuffledArray[0], shuffledArray[shuffledArray.length - 1]])
        for(let i = 1; i < shuffledArray.length; i++) {
            matchMatrix.push([shuffledArray[i], shuffledArray[i-1]])
        }
        return matchMatrix
    },
    sendEmails: async function(matchedArray, details) {
        try {
            let responses = []
            for(let matchedEntry of matchedArray) {
                let mail = {
                    to: matchedEntry[0].memberEmail,
                    from: mailDetails.senderEmail,
                    subject: mailDetails.subject + ` ${details.groupName} needs you!`,
                    text: `Surprise ${matchedEntry[1].memberName} with a gift! Their email is ${matchedEntry[1].memberEmail}, and they like ${matchedEntry[1].wishlist}.\n\nGroup was created by: ${details.ownerName}\nPrice suggestion: ${details.pricing}\nDate of exchange: ${details.date}`
                }
                let response = await sendgridMailer.send(mail)
                responses.push(response[0])
            }
            return responses
        } catch (e) {
            console.error(e)
            throw e
        }
    },
    sendEmail: async function(matchedEntry) {
        try {
            let mail = {
                to: matchedEntry[0],
                from: mailDetails.senderEmail,
                subject: mailDetails.subject,
                text: `Surprise ${matchedEntry[1]} with a gift!`
            }
            let response = await sendgridMailer.send(mail)
            return response[0]
        } catch (e) {
            console.error(e)
            throw e
        }
    }
}

export default groupFuncs