"use strict"

// Init the DOM components

const submitLogin = document.getElementById("submitLogin");
const guestLogin = document.getElementById("guestLogin");



// Adding Functionality

/**
 * Validates if the Name Input ist filled
 */
function loginInputValidation() {
    const nameInput = document.getElementById("nameInput");
    const nameValue = nameInput.value.trim();

    // Accepting only Letters (RegEx)
    const onlyLettersAndSingleSpaceRegEx = /^[A-Za-z]+ [A-Za-z]+$/;

    if (nameValue !== "" && onlyLettersAndSingleSpaceRegEx.test(nameValue)) {
        localStorage.setItem("username", nameValue)
        removeLoginElement(nameValue);
    } else {
        nameInput.classList.add("error");
        setTimeout(() => {
            nameInput.classList.remove("error");
        }, 1000);
    }
}

/**
 * Writes the Username in index.html and Removes the Login Element
 * @param {String} userName 
 */
function removeLoginElement(userName){
    const userNameDOM = document.getElementById("userName");
    const loginElement = document.querySelector(".login");
    userNameDOM.innerText = userName;

    loginElement.classList.add("d-none");
}



// Adding EventListener

/**
 * Validate the Login Form on Button click
 */
submitLogin.addEventListener("click", (event) => {
    // event.preventDefault();
    loginInputValidation();
})

/**
 * Validate the Login Form on Button click
 */
guestLogin.addEventListener("click", (event) => {
    // event.preventDefault();
    loginInputValidation();
})

/**
 * Check if a User already Exists and removes Login Validation
 */
document.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("username");

    if(userName){
        removeLoginElement(userName);
    }
})