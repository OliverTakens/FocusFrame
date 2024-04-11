"use strict"

// Init the DOM components

const navBar = document.querySelector(".navigationSidebar");
const menuToggleElement = document.querySelectorAll(".menuToggleIcon");
const searchInput = document.getElementById("searchInput");
// Array of all Finished Projects
const projects = [
    {name:"FocusFrame", path: "./index.html"},
    {name:"Flow Board", path: "./flow-board.html"},
    {name:"Task List", path: "./task-list.html"},
    {name:"Adress Book", path: "./adress-book.html"},
]



// Adding Functionality

/**
 * Adding Projects to Sidebar (Navigation)
 */
function displayProjects() {
    const navigationLinks = document.querySelector(".navigationLinks");
    navigationLinks.innerHTML = "";

    projects.forEach((project) => {
        let linkElement = document.createElement("a");
        linkElement.classList.add("navigationLink");
        linkElement.href = project.path;
        linkElement.innerText = project.name;

        navigationLinks.appendChild(linkElement);
    })
}

/**
 * Filter the Projects Array and update the Navbar on Search Input
 */
function searchProject() {
    const searchText = searchInput.value.toLowerCase().trim();

    const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchText));

    if(filteredProjects){
        const navigationLinks = document.querySelector(".navigationLinks");
        navigationLinks.innerHTML = "";

        filteredProjects.forEach((project) => {
            let linkElement = document.createElement("a");
            linkElement.classList.add("navigationLink");
            linkElement.href = project.path;
            linkElement.innerText = project.name;

            navigationLinks.appendChild(linkElement);
        })

        if(window.innerWidth <= 768){
            displaySidebar() //Muss dringend angepasst werden!!!
        }
    }
}

/**
 * Displays the Search result on the Smartphone **********Should be Fixed soon!!!
 */
function displaySidebar(){
    navBar.classList.add("navigationToggle");
    menuBurger.classList.toggle("d-none");
    menuClose.classList.toggle("d-none");
}

/**
 * Toggle the Navigation in the Smartphone Version
 * @param {Event} event 
 */
function toggleNavigation(event) {
    let target = event.target.id;
    
    const menuBurger = document.getElementById("menuBurger");
    const menuClose = document.getElementById("menuClose");

    menuBurger.classList.toggle("d-none");
    menuClose.classList.toggle("d-none");

    if(target === "menuBurger") {
        navBar.classList.add("navigationToggle");
    } else {
        navBar.classList.remove("navigationToggle");
    }
}



// Add EventListener

/**
 * Eventlistener for the Navigation Button
 */
menuToggleElement.forEach((button) => {
    button.addEventListener("click", (event) => {
        toggleNavigation(event);
    })
})

/**
 * Update the Navigation on search input
 */
searchInput.addEventListener("input", () => {
    searchProject();
})