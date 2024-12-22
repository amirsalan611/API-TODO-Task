const add = document.getElementById("add")
const body = document.getElementById("body")
const modal = document.getElementById("modal")
const back = document.getElementById("back")
const addBtn = document.getElementById("addBtn")
const nameInp = document.getElementById("nameInp")
const textarea = document.getElementById("textarea")
const Priority = document.getElementById("Priority")
const Status = document.getElementById("Status")
const date = document.getElementById("date")
const table = document.getElementById("table-body")
const editModal = document.getElementById("edit")


let array = []

CreateTable()

add.addEventListener('click',( )=> {
    modal.classList.remove("hidden")
})
back.addEventListener('click',()=>{
    modal.classList.add("hidden")
})

addBtn.addEventListener('click',()=>{

    const taskNameValue = nameInp.value;
    const taskValue = textarea.value;
    const PriorityValue = Priority.value;
    const StatusValue = Status.value;
    const dateValue = date.value;

    array = JSON.parse(localStorage.getItem('toDoList')) || [],

    array.push({'id': Date.now(),
        'taskName': taskNameValue,
            'taskValue': taskValue,
            'Priority': PriorityValue,
            'Status': StatusValue,
            'date': dateValue,
    })

    localStorage.setItem('toDoList',JSON.stringify(array))


    modal.classList.add("hidden")
    nameInp.value=""
    textarea.value=""
    Priority.value="default"
    Status.value="default"
    date.value="none"

    document.getElementById("loading").classList.remove("hidden")

    new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 2000);
    }).then(() => {

    CreateTable()
});

})

function CreateTable() {

    table.innerHTML = ""
    array = JSON.parse(localStorage.getItem('toDoList')) || [],
    array.forEach(item => {
    table.innerHTML +=`<tr>
    <td class="border p-2">${item.taskName}</td>
    <td class="border p-2 text-center" id="pri"><div class="${styling(item.Priority)}">${item.Priority}</div></td>
    <td class="border p-2 text-center" ><div class="${statusStyling(item.Status)}">${item.Status}</div></td>
    <td class="border p-2 text-center">${item.date}</td>
    <td class="border p-2 text-center flex gap-2 justify-center -[400px]">
        <img src="./assets/images/trash-icone.png" alt="Trash Icon" class="bg-[#dc3545] w-[30px] h-[30px] rounded-lg p-[5px] cursor-pointer" id="${item.id}" onclick="deleteItem(${item.id})">
        <img src="./assets/images/pen-icone.png" alt="" class="bg-[#0d6efd] w-[30px] h-[30px] rounded-lg p-[5px] cursor-pointer" id="${item.id}" onclick="edit(${item.id})">
        <img src="./assets/images/eye-icone.png" alt="" class="bg-gray-400 w-[30px] h-[30px] rounded-lg p-[5px] cursor-pointer" id="${item.id}" onclick="read(${item.id})"=>
    </td>
</tr>`
document.getElementById("loading").classList.add("hidden")
});
}

function styling(Priority) {

    if(Priority === "Low"){
        return("bg-gray-400 rounded-[20px] p-[5px] w-[80px] m-auto")
    }else if (Priority === "Medium") {
        return("bg-[#ffc107] rounded-[20px] p-[5px] w-[80px] m-auto")
    }else if (Priority === "High"){
        return("bg-[#dc3545] rounded-[20px] p-[5px] w-[80px] m-auto")
    }
}

function statusStyling(Status) {
    if (Status === "Todo") {
        return("bg-[#dc3545] rounded-[20px] p-[5px] w-[80px] m-auto")
    }else if (Status === "Doing"){
        return("bg-[#ffc107] rounded-[20px] p-[5px] w-[80px] m-auto")
    }else if(Status === "Done"){
        return("bg-[#2e7d32] rounded-[20px] p-[5px] w-[80px] m-auto")
    }
}

function deleteItem(id) {

    array = array.filter(item=>item.id!==id)
    localStorage.setItem('toDoList',JSON.stringify(array))
    CreateTable()
}

let arrayItem=[]

function edit(id) {

const taskNameInp = document.getElementById("taskName")
const textareaTextInp = document.getElementById("textareaText")
const PriorityItem = document.getElementById("PriorityItem")
const StatusItem = document.getElementById("StatusItem")
const dateItem = document.getElementById("dateItem")

arrayItem = array.find(item=>item.id===id)

editModal.classList.remove("hidden")

taskNameInp.value = arrayItem.taskName
textareaTextInp.value = arrayItem.taskValue
PriorityItem.value = arrayItem.Priority
StatusItem.value = arrayItem.Status
dateItem.value = arrayItem.date

editSubmitBtn.addEventListener('click',()=>{

    let edited = array.find(item=>item.id===arrayItem.id)

    edited.taskName = taskNameInp.value
    edited.taskValue = textareaTextInp.value
    edited.Priority = PriorityItem.value
    edited.Status = StatusItem.value
    edited.date = dateItem.value

    localStorage.setItem('toDoList',JSON.stringify(array))

    CreateTable()

    editModal.classList.add("hidden")
})
}


function read(id) {
    document.getElementById("readTaskBox").classList.remove("hidden")

    let task = array.find(item=>item.id===id)

    document.getElementById("ReadingTaskName").textContent = task.taskName
    document.getElementById("ReadingTaskValue").textContent = task.taskValue
    document.getElementById("ReadingTaskPriority").textContent = `Priority : ${task.Priority}`
    document.getElementById("ReadingTaskStatus").textContent = `Status : ${task.Status}`
    document.getElementById("ReadingTaskDate").textContent = `Deadline : ${task.date}`
    

    CloseReadingModal()
}

function CloseReadingModal() {
    const folan =document.getElementById("CloseReading")
    
    folan.addEventListener('click',()=>{document.getElementById("readTaskBox").classList.add("hidden")})
}
