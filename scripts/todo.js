"use strict"

// Init DOM Elements
const createTodoButton = document.getElementById("createTodo");
const addTodoElement = document.querySelector(".addTodoContainer");
const addTodoCloseButton = document.querySelector(".todoCloseButton");
const overlay = document.querySelector(".overlay");
const addTaskButton = document.getElementById("addTaskButton");
const todoInput = document.getElementById("task");
const descriptionInput = document.getElementById("description");
const urgencyInput = document.getElementById("urgency");
const teamInput = document.getElementById("team");
const dateInput = document.getElementById("date");
const todosElement = document.querySelector(".tasks");
const todoInfosClose = document.querySelector(".todoInfosClose");
const todoInfos = document.querySelector(".todoInfos");
const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
const inputs = [
    document.getElementById("task"),
    document.getElementById("description"),
    document.getElementById("urgency"),
    document.getElementById("date")
];
// List of all Todos
let todos = [];



// Adding Functionality

/**
 * Creates option elements and adds them to the employee input
 */
function createTeamInput() {
    contacts.forEach((contact) => {
        const option = document.createElement("option");
        option.value = contact.id;
        option.textContent = contact.name;

        teamInput.appendChild(option);
    })
}

/**
 * Check if all Inputs are filled
 * @returns a boolean
 */
function checkInputs() {
    let allValid = true;
    inputs.forEach(input => {
        if (input.value.trim() === "") {
            toggleError(input);
            allValid = false;
        }
    });
    return allValid;
}

/**
 * Adds a class to an HTML element and removes it after a certain time
 * @param {HTMLInputElement} input 
 */
function toggleError(input) {
    input.classList.add("error");
    setTimeout(() => {
        input.classList.remove("error");
    }, 1000);
}

/**
 * Removes or adds the "Addtodo" sidebar
 * @param {Event} event 
 */
function toggleAddTodoElement(event) {
    if(event){
        event.preventDefault();
    }
    addTodoElement.classList.toggle("transformBack");
    overlay.classList.toggle("d-none");
}

/**
 * Checks whether a todo already exists
 * @param {String} newTodoValue 
 */
function checkExistingTodos(newTodoValue) {
    let checkTodos = true;

    // If Todo exists
    for(let todo of todos){
        if(todo.todo.toLowerCase() === newTodoValue.toLowerCase().trim()){
            markExistingTodo(todo.todo);
            checkTodos = false;
        }
    }

    // if Todo doesnt exists
    if(checkTodos){
        addTodo();
    }
}

/**
 * Marks a todo with a colored background and removes it after a certain time
 * @param {String} existingTodo 
 */
function markExistingTodo(existingTodo) {
    const todoElements = document.querySelectorAll(".task span")
    toggleAddTodoElement();

    todoElements.forEach((todo) => {
        if(todo.innerText.toLowerCase() === existingTodo.toLowerCase().trim()){
            todo.parentElement.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
            setTimeout(() => {
                todo.parentElement.style.backgroundColor = "";
            }, 1000);
        }
    })
}

/**
 * Adds a Object to the Todo Array (Creating a new Todo)
 */
function addTodo() {
    let todo = {todo: todoInput.value.trim(), description: descriptionInput.value.trim(), urgency: urgencyInput.value, date: dateInput.value, team: teamInput.value, position: "0"};

    todos.push(todo);

    sortTodosByDate();
    clearInputValue();
}

/**
 * Fills the input fields with the corresponding data if a user wants to edit them
 * @param {Number} id 
 */
function editTodo(id) {
    let todo = todos[id];
    document.getElementById("todoId").textContent = id;
    todoInput.value = todo.todo;
    descriptionInput.value = todo.description;
    urgencyInput.value = todo.urgency;
    dateInput.value = todo.date;

    createTeamInput();
    addOrEditDOM("edit");
    toggleAddTodoElement();
}

/**
 * Updates the Button Text for the right Modus
 * @param {String} mode 
 */
function addOrEditDOM(mode) {
    const todoHeading = document.getElementById("addTodoContainerHeading");
    
    if(mode === "edit"){
        todoHeading.textContent = "Edit Task:";
        addTaskButton.textContent = "Edit Task";
    } else if(mode === "add"){
        todoHeading.textContent = "Add Task:";
        addTaskButton.textContent = "Add Task";
    }
}

/**
 * Sorts the Todos Array by the Date
 */
function sortTodosByDate() {
    todos.sort((a, b) => new Date(a.date) - new Date(b.date));
    createTodoElement();
    saveData();
}

/**
 * Creates the Todo Element and pushed it into the DOM
 */
function createTodoElement() {
    todosElement.innerHTML = "";

    for(let i = 0; i < todos.length; i++){
        let todo = todos[i];

        let taskDiv = document.createElement("div");
        taskDiv.classList.add("task");

        let todoNameSpan = document.createElement("span");
        todoNameSpan.innerText = todo.todo;
        todoNameSpan.addEventListener("click", () => {
            toggleTaskInfo(i);
        })

        let taskEditDiv = document.createElement("div");
        taskEditDiv.classList.add("taskEdit");

        taskDiv.append(todoNameSpan, taskEditDiv);

        let editElement = document.createElement("a");
        editElement.innerText = "Edit";
        editElement.addEventListener("click", () => {
            editTodo(i);
        })

        let iElement = document.createElement("i");
        iElement.classList.add("bx", "bx-x", "deleteTask");
        iElement.addEventListener("click", () => {
            taskDiv.remove();
            removeTodo(i);
        })

        taskEditDiv.append(editElement, iElement)

        todosElement.appendChild(taskDiv);
    }

    toggleAddTodoElement();
}

/**
 * Opens a popup with all the details available for a todo
 * @param {Number} id 
 */
function toggleTaskInfo(id) {
    overlay.classList.toggle("d-none");
    todoInfos.classList.toggle("display");

    if(id !== null && id !== undefined){
        updateTaskInfo(id);
    }
}

/**
 * Updates the DOM with all information on the current todo
 * @param {Number} id 
 */
function updateTaskInfo(id) {
    const taskHeading = document.querySelector(".taskHeading");
    const taskDate = document.getElementById("taskDate");
    const taskUrgency = document.getElementById("taskUrgency");
    const taskDescription = document.querySelector(".taskDescription");
    const todoInfosID = document.getElementById("todoInfosID");

    taskHeading.textContent = todos[id].todo;
    taskDate.textContent = todos[id].date;
    taskUrgency.textContent = todos[id].urgency;
    taskDescription.textContent = todos[id].description;
    todoInfosID.textContent = id;
}

/**
 * Removes a Todo of the Todos Array
 * @param {Number} id 
 */
function removeTodo(id) {
    todos.splice(id, 1);
    sortTodosByDate();
    toggleAddTodoElement();
}

/**
 * Clears all Inputs of the "AddTodo" Sidebar
 */
function clearInputValue() {
    todoInput.value = "";
    descriptionInput.value = "";
    urgencyInput.value = "";
    dateInput.value = "";
    teamInput.value = "";
}



// Add EventListener

/**
 * Toggles the "addTodo" Sidebar
 */
createTodoButton.addEventListener("click", (event) => {
    clearInputValue();
    addOrEditDOM("add");
    toggleAddTodoElement(event);
    createTeamInput();
});

/**
 * Close the "addTodo" Sidebar
 */
addTodoCloseButton.addEventListener("click", () => {
    toggleAddTodoElement();
})

/**
 * Ensures that the overlay is collapsible and hides the sidebar or pop-up info
 */
document.addEventListener("click", (event) => {
    if(event.target === overlay && addTodoElement.classList.contains("transformBack")){
        toggleAddTodoElement(event);
    }

    if(event.target === overlay && todoInfos.classList.contains("display")){
        toggleTaskInfo();
    }
})

/**
 * Checks whether a task is being edited or added and then starts the "addTodo" process
 */
addTaskButton.addEventListener("click", (event) => {
    event.preventDefault();
    const allInputsValid = checkInputs();
    if (allInputsValid) {
        if (addTaskButton.innerText === "Add Task") {
            checkExistingTodos(todoInput.value.trim());
        } else {
            const todoId = parseInt(document.getElementById("todoId").textContent, 10);
            removeTodo(todoId);
            checkExistingTodos(todoInput.value.trim());
        }
    }
});

/**
 * Close the "PopupInfo"
 */
todoInfosClose.addEventListener("click", () => {
    toggleTaskInfo();
})

/**
 * Ensures that a todo can also be edited via the PopupInfo
 */
document.getElementById("todoInfoEdit").addEventListener("click", () => {
    const todoInfosID = document.getElementById("todoInfosID").innerText;
    editTodo(todoInfosID);
    toggleTaskInfo();
})

/**
 * Ensures that a todo can also be deleted via the PopupInfo
 */
document.getElementById("todoInfoTrash").addEventListener("click", () => {
    const todoInfosID = document.getElementById("todoInfosID").innerText;
    removeTodo(todoInfosID);
    toggleTaskInfo();
})






// Local Storage

function loadData() {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
        todos = JSON.parse(storedTodos);
        sortTodosByDate();
        sortTodosByDate();
    }
}

function saveData() {
    localStorage.setItem("todos", JSON.stringify(todos));
}