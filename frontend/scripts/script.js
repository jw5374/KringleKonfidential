const fetchURL = "http://localhost:8080/"
let submit = document.querySelector("#testSubmit")
let input = document.querySelector("#testFetch")
let container = document.querySelector(".groupContainer")
let parent = document.querySelector(".grid-section.second")

function createGroupElements(groupArray) {
    console.log(groupArray)
    let elArray = []
    for(let group of groupArray) {
        let groupEl = document.createElement("div")
        let header = document.createElement("h1")
        let body = document.createElement("p")
        let memberList = document.createElement("p")
        header.textContent = group.groupId
        body.innerHTML = `${group.ownerEmail} <br> Group Members:<br>`
        for(let member of group.groupMembers) {
            memberList.insertAdjacentHTML('beforeend', `${member} <br>`)
        }
        body.appendChild(memberList)
        groupEl.appendChild(header)
        groupEl.appendChild(body)
        elArray.push(groupEl)
    }
    return elArray
}

function insertGroupElements(groupEls, container) {
    container
    let docFrag = document.createDocumentFragment()
    for(let el of groupEls) {
        docFrag.appendChild(el)
    }
    container.appendChild(docFrag)
}

function clearElements(container) {
    while(container.firstChild) {
        container.removeChild(container.lastChild)
    }
}

submit.addEventListener("click", async () => {
    try {
        clearElements(container)
        let groups
        console.log(input.value)
        if(input.value) {
            groups = await fetch(fetchURL + "groups/group?groupID=" + input.value, {
                method: 'GET'
            }).then(res => res.json()).then(result => [result])
        } else {
            groups = await fetch(fetchURL + "groups/group", {
                method: 'GET'
            }).then(res => res.json()).then(result => result)
        }
        let els = createGroupElements(groups)
        insertGroupElements(els, container)
        parent.classList.add("expand")
        if(parent.offsetHeight < window.innerHeight) {
            parent.classList.remove("expand")
        }
    } catch (e) {
        console.log(e)
    }
})