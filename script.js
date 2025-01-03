const add = document.getElementById("add");
const body = document.getElementById("body");
const modal = document.getElementById("modal");
const back = document.getElementById("back");
const addBtn = document.getElementById("addBtn");
const nameInp = document.getElementById("nameInp");
const textarea = document.getElementById("textarea");
const Priority = document.getElementById("Priority");
const Status = document.getElementById("Status");
const date = document.getElementById("date");
const table = document.getElementById("table-body");
const editModal = document.getElementById("edit");
const form = document.getElementById("form");
const formAlert = document.getElementById("formAlert");
const filter = document.getElementById("filterIcon");
const sortBox = document.getElementById("sort-box");

const baseURL = `https://675f29cb1f7ad2426997bda6.mockapi.io/amirSalan`;

let array = [];

CreateTable();

add.addEventListener("click", () => {
  modal.classList.remove("hidden");
});
back.addEventListener("click", () => {
  modal.classList.add("hidden");
});

function addTask() {
  const taskNameValue = nameInp.value;
  const taskValue = textarea.value;
  const PriorityValue = Priority.value;
  const StatusValue = Status.value;
  const dateValue = date.value;
  const taskDate = Date.now();
  if (
    taskNameValue &&
    taskValue &&
    PriorityValue !== "default" &&
    StatusValue !== "default" &&
    dateValue
  ) {
    fetch(`${baseURL}/user`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskName: taskNameValue,
        task: taskValue,
        Priority: PriorityValue,
        Status: StatusValue,
        deadline: dateValue,
        date: taskDate,
      }),
    }).then(() => {
      modal.classList.add("hidden");
      nameInp.value = "";
      textarea.value = "";
      Priority.value = "default";
      Status.value = "default";
      date.value = "none";

      formAlert.classList.add("hidden");
      form.classList.remove("pt-2");
      nameInp.classList.remove("border-2", "border-red-400");
      textarea.classList.remove("border-2", "border-red-400");
      Priority.classList.remove("border-2", "border-red-400");
      Status.classList.remove("border-2", "border-red-400");
      date.classList.remove("border-2", "border-red-400");

      CreateTable();
    });
  } else {
    formAlert.classList.remove("hidden");
    form.classList.add("pt-2");
    if (!taskNameValue) nameInp.classList.add("border-2", "border-red-400");
    if (!taskValue) textarea.classList.add("border-2", "border-red-400");
    if (PriorityValue === "default")
      Priority.classList.add("border-2", "border-red-400");
    if (StatusValue === "default")
      Status.classList.add("border-2", "border-red-400");
    if (!dateValue) date.classList.add("border-2", "border-red-400");
  }
}

document.getElementById("loading").classList.remove("hidden");

filterIcon.addEventListener("click", () => {
  const sortBox = document.querySelector("#sort-box");
  sortBox.classList.remove("hidden");
  sortBox.classList.toggle("visible");
});

function closeSort() {
  sortBox.classList.toggle("visible");
}

async function CreateTable() {
  try {
    document.getElementById("loading").classList.remove("hidden");
    table.innerHTML = "";
    const response = await fetch(`${baseURL}/user`);
    const result = await response.json();

    const selectOption = document.querySelector('input[name="sort"]:checked');

    let tasks = (await result) ?? [];

    switch (selectOption.id) {
      case "sortByDate-Oldest":
        tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "sortByDate-Newest":
        tasks.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "sortByTodo":
        tasks = tasks.filter((task) => task.Status === "Todo");
        break;
      case "sortByDoing":
        tasks = tasks.filter((task) => task.Status === "Doing");
        break;
      case "sortByDone":
        tasks = tasks.filter((task) => task.Status === "Done");
        break;
    }

    console.log(tasks);

    tasks.forEach((item) => {
      table.innerHTML += `<tr>
    <td class="border p-2">${item.taskName}</td>
    <td class="border p-2 text-center" id="pri"><div class="${styling(
      item.Priority
    )}">${item.Priority}</div></td>
    <td class="border p-2 text-center" ><div class="${statusStyling(
      item.Status
    )}">${item.Status}</div></td>
    <td class="border text-center "><p class="border border-blue-400 w-[120px] rounded-xl m-auto">${
      item.deadline
    }</p></td>
    <td class="border p-3 text-center flex gap-2 justify-center -[400px]">
        <img src="./assets/images/trash-icone.png" alt="Trash Icon" class="bg-[#dc3545] w-[30px] h-[30px] rounded-lg p-[5px] cursor-pointer" id="${
          item.id
        }" onclick="deleteItem(${item.id})">
        <img src="./assets/images/pen-icone.png" alt="" class="bg-[#0d6efd] w-[30px] h-[30px] rounded-lg p-[5px] cursor-pointer" id="${
          item.id
        }" onclick="edit(${item.id})">
        <img src="./assets/images/eye-icone.png" alt="" class="bg-gray-400 w-[30px] h-[30px] rounded-lg p-[5px] cursor-pointer" id="${
          item.id
        }" onclick="read(${item.id})"=>
    </td>
</tr>`;
    });
    document.getElementById("loading").classList.add("hidden");
  } catch {}
}

function styling(Priority) {
  if (Priority === "Low") {
    return "bg-gray-200 rounded-[20px] p-[5px] w-[80px] m-auto";
  } else if (Priority === "Medium") {
    return "bg-[#ffc107] rounded-[20px] p-[5px] w-[100px] m-auto";
  } else if (Priority === "High") {
    return "bg-[#dc3545] rounded-[20px] p-[5px] w-[80px] m-auto";
  }
}

function statusStyling(Status) {
  if (Status === "Todo") {
    return "bg-[#dc3545] rounded-[20px] p-[5px] w-[80px] m-auto";
  } else if (Status === "Doing") {
    return "bg-[#ffc107] rounded-[20px] p-[5px] w-[80px] m-auto";
  } else if (Status === "Done") {
    return "bg-[#2e7d32] rounded-[20px] p-[5px] w-[80px] m-auto";
  }
}

function deleteItem(id) {
  fetch(`${baseURL}/user/${id}`, {
    method: "delete",
  }).then(() => {
    CreateTable();
  });
}

let arrayItem = [];

async function edit(id) {
  const taskNameInp = document.getElementById("taskName");
  const textareaTextInp = document.getElementById("textareaText");
  const PriorityItem = document.getElementById("PriorityItem");
  const StatusItem = document.getElementById("StatusItem");
  const dateItem = document.getElementById("dateItem");

  const response = await fetch(`${baseURL}/user/${id}`);
  const editingTask = await response.json();

  editModal.classList.remove("hidden");

  taskNameInp.value = editingTask.taskName;
  textareaTextInp.value = editingTask.task;
  PriorityItem.value = editingTask.Priority;
  StatusItem.value = editingTask.Status;
  dateItem.value = editingTask.deadline;

  editSubmitBtn.addEventListener("click", () => {
    const updatedTask = {
      taskName: taskNameInp.value,
      task: textareaTextInp.value,
      Priority: PriorityItem.value,
      Status: StatusItem.value,
      deadline: dateItem.value,
    };
    fetch(`${baseURL}/user/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    }).then(() => {
      CreateTable();

      editModal.classList.add("hidden");
    });
  });
}

async function read(id) {
  document.getElementById("ReadingTaskName").textContent = ""
  document.getElementById("ReadingTaskValue").textContent = ""
  document.getElementById("ReadingTaskPriority").textContent = ""
  document.getElementById("ReadingTaskStatus").textContent = ""
  document.getElementById("ReadingTaskStatus").textContent = ""

  document.getElementById("readTaskBox").classList.remove("hidden");

  const response = await fetch(`${baseURL}/user/${id}`);
  const readingTask = await response.json();
  console.log(readingTask);


  document.getElementById("ReadingTaskName").textContent = readingTask.taskName;
  document.getElementById("ReadingTaskValue").textContent = readingTask.task;
  document.getElementById(
    "ReadingTaskPriority"
  ).textContent = `Priority : ${readingTask.Priority}`;
  document.getElementById(
    "ReadingTaskStatus"
  ).textContent = `Status : ${readingTask.Status}`;
  document.getElementById(
    "ReadingTaskStatus"
  ).textContent = `Deadline : ${readingTask.deadline}`;

  CloseReadingModal();
}

function CloseReadingModal() {
  const c = document.getElementById("CloseReading");

  c.addEventListener("click", () => {
    document.getElementById("readTaskBox").classList.add("hidden");
  });
}
