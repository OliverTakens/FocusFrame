"use strict"

// Initialize DOM elements related to contact management UI.
const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
const todos = JSON.parse(localStorage.getItem('todos') || '[]');
const todoLaneElement = document.getElementById("todoLane");
const doingLaneElement = document.getElementById("doingLane");
const doneLaneElement = document.getElementById("doneLane");
const swimLane = document.querySelectorAll(".swimLane");
const todoInfoTrash = document.getElementById("todoInfoTrash");



// Adding Functions

/**
 * Displays all Tasks of the "Todos" Array in the DOM
 */
function displayTasks() {
    [todoLaneElement, doingLaneElement, doneLaneElement].forEach(element => element.innerHTML = "");

    for(let i = 0; i < todos.length; i++){
        let todo = todos[i];
        let todoElement = kanbanTaskHTML(todo, i);

        if(todo.position === "0"){
            todoLaneElement.innerHTML += todoElement;
        } else if(todo.position === "1"){
            doingLaneElement.innerHTML += todoElement;
        } else {
            doneLaneElement.innerHTML += todoElement;
        }

        checkUrgency(todo, i);
        checkInitials(todo, i);
        initializeDragAndDrop();
    }
}

/**
 * Checks the status of the urgency and then displays it correctly in the DOM
 * @param {Object} todo 
 * @param {Number} id 
 */
function checkUrgency(todo, id) {
    const urgencyConfig = {
        "Low": {class: "bx-chevrons-down", color: "green"},
        "Middle": {class: "bx-menu", color: "orange"},
        "High": {class: "bx-chevrons-up", color: "red"}
    };

    const currentConfig = urgencyConfig[todo.urgency];
    if (currentConfig) {
        let currentTaskElement = document.querySelector(`.kanbanTask[data-id="${id}"]`);
        let iElement = document.createElement("i");
        iElement.classList.add("kanbanUrgency", "bx", currentConfig.class);
        iElement.style.color = currentConfig.color;
        currentTaskElement.appendChild(iElement);
    }
}

/**
 * Creates an initial element in the "KanbanTask" and adds it to the DOM
 * @param {Object} todo 
 * @param {Number} id 
 */
function checkInitials(todo, id) {
    let currentTaskElement = document.querySelector(`.kanbanTask[data-id="${id}"]`);

    if(todo.team !== ""){
        let kanbanInitials = document.createElement("div");
        kanbanInitials.classList.add("kanbanInitials");
        kanbanInitials.textContent = contacts[todo.team].initials;

        currentTaskElement.appendChild(kanbanInitials);
    }
}

/**
 * Toggle the Information Popup of the "KanbanTasks"
 */
function togglePopup() {
    let overlay = document.querySelector(".overlay");
    let todoInfosPopup = document.querySelector(".todoInfos");

    overlay.classList.toggle("d-none");
    todoInfosPopup.classList.toggle("display");
}

/**
 * Updates the popup DOM element with the information of the currently displayed task
 * @param {Number} id 
 */
function updatePopupInfos(id) {
    let currentTask = todos[id];
    let taskHeading = document.querySelector(".taskHeading");
    let taskDate = document.getElementById("taskDate");
    let taskUrgency = document.getElementById("taskUrgency");
    let taskDescription = document.querySelector(".taskDescription");
    let todoInfosID = document.getElementById("todoInfosID");

    taskHeading.textContent = currentTask.todo;
    taskDate.textContent = currentTask.date;
    taskUrgency.textContent = currentTask.urgency;
    taskDescription.textContent = currentTask.description;
    todoInfosID.textContent = id;

    updateUrgencyColor();
    checkTeamMember(currentTask);
}

/**
 * Updates the Urgency background in the Popup
 */
function updateUrgencyColor() {
    let taskUrgency = document.getElementById("taskUrgency");
    
    if(taskUrgency.textContent === "High"){
        taskUrgency.style.background = "red";
    } else if (taskUrgency.textContent === "Middle"){
        taskUrgency.style.background = "orange";
    } else {
        taskUrgency.style.background = "green";
    }
}

/**
 * Checks whether a task is assigned to several employees and displays this in the DOM
 * @param {Object} todo 
 */
function checkTeamMember(todo) {
    let teamBoxElement = document.querySelector(".teamBox");
    let teamMemberInitialsElement = document.getElementById("teamMemberInitials");
    let teamMemberNameElement = document.getElementById("teamMemberName");

    if(todo.team !== ""){
        teamBoxElement.classList.remove("d-none");
        teamMemberInitialsElement.textContent = contacts[todo.team].initials;
        teamMemberNameElement.textContent = contacts[todo.team].name;
    } else {
        teamBoxElement.classList.add("d-none");
    }
}

/**
 * Removes a Todo
 */
function removeTodo() {
    let todoInfosID = document.getElementById("todoInfosID");

    todos.splice(todoInfosID.textContent, 1);
    saveData();
    displayTasks()
    togglePopup();
}

/**
 * Adds a CSS class to indicate that the element is being dragged.
 * This function is meant to be attached to a dragstart event.
 */
function onDragStart() {
    this.classList.add("isDragging");
}

/**
 * Removes the CSS class that indicates the element is being dragged.
 * This function is meant to be attached to a dragend event.
 */
function onDragEnd() {
    this.classList.remove("isDragging");
    
    // Check in which lane the Todo is
    const parentLane = this.closest(".swimLane");
    let newPosition;
    if (parentLane === todoLaneElement) {
        newPosition = "0";
    } else if (parentLane === doingLaneElement) {
        newPosition = "1";
    } else if (parentLane === doneLaneElement) {
        newPosition = "2";
    }

    // Refresh position of Todo Element
    const taskId = this.getAttribute('data-id');
    todos[taskId].position = newPosition;
    saveData()
}

/**
 * Handles the dragover event on drop zones.
 * Prevents the default action to allow dropping, determines the insertion point based on mouse position,
 * and moves the dragged element to its new position within the drop zone.
 * 
 * @param {Event} event - The dragover event object.
 */
function onDragOver(event) {
    event.preventDefault();
    const zone = this; 
    const mouseY = event.clientY; 
    const bottomTask = insertAboveTask(zone, mouseY); 
    const currentTask = document.querySelector(".isDragging");

    if (!bottomTask) {
        zone.appendChild(currentTask); 
    } else {
        zone.insertBefore(currentTask, bottomTask); 
    }
}


/**
 * Determines the first task element in a drop zone that is located below the mouse pointer.
 * Used to find the insertion point for the dragged element.
 * 
 * @param {HTMLElement} zone - The drop zone element containing tasks.
 * @param {number} mouseY - The Y-coordinate of the mouse pointer within the viewport.
 * @returns {HTMLElement|null} The task element to insert the dragged element above, or null if the dragged element should be placed at the end.
 */
function insertAboveTask(zone, mouseY) {
    const tasks = [...zone.querySelectorAll(".kanbanTask:not(.isDragging)")]; // Get all task elements in the zone that are not currently being dragged

    for (let task of tasks) {
        const box = task.getBoundingClientRect(); // Get the task element's position and size
        if (mouseY < box.bottom) { // Check if the mouse pointer is above the task element
            return task; // Return this task as the insertion point
        }
    }

    return null; // Return null if no suitable task is found (the dragged element should be placed at the end)
}

/**
 * Initializes the drag and drop functionality by attaching event listeners to draggable tasks and drop zones.
 */
function initializeDragAndDrop() {
    const draggables = document.querySelectorAll(".kanbanTask"); 
    const droppables = document.querySelectorAll(".swimLane"); 

    draggables.forEach(task => {
        task.addEventListener("dragstart", onDragStart); 
        task.addEventListener("dragend", onDragEnd); 
    });

    droppables.forEach(zone => {
        zone.addEventListener("dragover", onDragOver); 
    });
}



// Add Event Listener

/**
 * Adding Click Event to open the Info Popup
 */
swimLane.forEach((lane) => {
    lane.addEventListener("click", (event) => {
        let kanbanTask = event.target.closest(".kanbanTask");

        if(kanbanTask){
            let id = kanbanTask.getAttribute("data-id");
            togglePopup();
            updatePopupInfos(id);
        }
    })
})

/**
 * Close the Popup
 */
document.addEventListener("click", (event) => {
    if(event.target.classList.contains("overlay") || event.target.classList.contains("todoCloseButton")){
        togglePopup();
    }
})

/**
 * Listener to remove the currently Displayed Task
 */
todoInfoTrash.addEventListener("click", () => {
    removeTodo();
})



// Create HTML Functions

/**
 * Creates a HTML String of a Task Element to display it into the DOM
 * @param {Object} todo 
 * @param {Number} id 
 * @returns 
 */
function kanbanTaskHTML(todo, id) {
    return `<div class="kanbanTask" draggable="true" data-id="${id}">
                <p class="kanbanTaskHeading">${todo.todo}</p>
                <p class="kanbanTaskDescription">${todo.description}</p>
            </div>`
}





// LocalStorage Data

function loadData() {
    let storedData = localStorage.getItem("todos");
    if(storedData){
        todos = JSON.parse(storedData);
    }
}

function saveData() {
    localStorage.setItem("todos", JSON.stringify(todos));
}