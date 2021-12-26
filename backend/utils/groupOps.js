const groupFuncs = {
    shuffleMembers: function(groupArray) {
        let swapIndex, min
        let max = groupArray.length
        for(let i = 0; i < groupArray.length - 1; i++) {
            min = i+1
            swapIndex = Math.floor(Math.random() * (max - min) + min)
            let temp = groupArray[i]
            groupArray[i] = groupArray[swapIndex]
            groupArray[swapIndex] = temp
        }
        return groupArray
    },
    matchMembers: function(shuffledArray) {
        let matchMatrix = []
        matchMatrix.push([shuffledArray[0], shuffledArray[shuffledArray.length - 1]])
        for(let i = 1; i < shuffledArray.length; i++) {
            matchMatrix.push([shuffledArray[i], shuffledArray[i-1]])
        }
        return matchMatrix
    }
}

export default groupFuncs