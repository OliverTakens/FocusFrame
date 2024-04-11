"use strict"

// Init all DOM Elements and load Local Storage Data

const contacts = JSON.parse(localStorage.getItem('contacts') || '[]');
const todos = JSON.parse(localStorage.getItem('todos') || '[]');
const todoLengthElement = document.getElementById("todoLength");
const startedTasksElement = document.getElementById("startedTasks");
const finishedTasksElement = document.getElementById("finishedTasks");
const contactsLengthElement = document.getElementById("contactsLength");
const urgentTaskBoxHeading = document.getElementById("urgentTaskBoxHeading");
const urgentTaskDate = document.getElementById("urgentTaskDate");
const urgentTaskDescription = document.querySelector(".urgentTaskDescription");



// Adding Functionality

/**
 * Update the Amount of started and Finished Tasks
 * @param {Number} position 
 * @returns The number of tasks that have been started and completed
 */
function countTasksByPosition(position) {
    return todos.reduce((count, todo) => {
        return todo.position === position ? count + 1 : count;
    }, 0);
}

/**
 * Updates the data in the DOM each time the index is called up
 */
function updateDOMContent() {
    if(contacts.length >= 1){
        contactsLengthElement.textContent = contacts.length;
    }

    if(todos.length >= 1){
        urgentTaskBoxHeading.textContent = todos[0].todo;
        urgentTaskDate.textContent = todos[0].date;
        urgentTaskDescription.textContent = todos[0].description;
        todoLengthElement.textContent = todos.length;
        startedTasksElement.textContent = countTasksByPosition("1");
        finishedTasksElement.textContent = countTasksByPosition("2");
    }
}
updateDOMContent()