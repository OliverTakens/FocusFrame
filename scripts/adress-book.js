"use strict"

// Initialize DOM elements related to contact management UI.

const addContactButton = document.querySelector(".addContactButton");
const editContactButton = document.getElementById("editContact");
const actionButton = document.getElementById("createContactButton");
// Input elements for new contact information.
const inputs = [
    document.getElementById("newContactName"),
    document.getElementById("newContactPhone"),
    document.getElementById("newContactMail")
];
// DOM elements that display contact information in the UI.
const elements = [
    document.querySelector(".contactHeading"),
    document.querySelector(".contactInfo"),
    document.querySelector(".contactEmail"),
    document.querySelector(".contactPhone"),
    document.querySelector(".nameFlex")
];
// Initialize contacts array with sample data.
let contacts = [];



// Adding Functions

/**
 * Function to toggle the visibility of the contact creation/edit popup.
 */
function toggleAddContactPopup() {
    const overlay = document.querySelector(".overlay");
    const addContactPopup = document.querySelector(".addContactPopup");

    overlay.classList.toggle("d-none");
    addContactPopup.classList.toggle("show");
}

/**
 * Determines if user input fields are empty to decide between contact removal or addition.
 */
function removeOrAddContact() {
    let allEmpty = true; 

    inputs.forEach(input => {
        if (input.value.trim() !== "") {
            allEmpty = false; 
        }
    });

    if (allEmpty) {
        // If all inputs are empty, remove the contact, sort contacts, and close the popup.
        removeContact();
        sortContacts();
        toggleAddContactPopup();
        toggleContactArea(false);
    } else {
        // If any input is filled, proceed with editing or adding the contact.
        checkInputs(editContact);
    }
}

/**
 * Validates input fields and triggers the provided callback function if validation passes.
 * @param {Function} callback 
 */
function checkInputs(callback) {
    let allValid = true;

    inputs.forEach(input => {
        if (input.value.trim() === "") {
            toggleError(input);
            allValid = false;
        }
    });

    if (allValid && typeof callback === "function") {
        callback();
    }
}

/**
 * Applies an 'error' class to an input element to visually indicate an error, then removes it after a timeout.
 * @param {HTMLInputElement} input 
 */
function toggleError(input) {
    input.classList.add("error");
    setTimeout(() => {
        input.classList.remove("error");
    }, 1000);
}

/**
 * Adds a new contact with the information provided in the input fields.
 */
function addNewContact() {
    addContact(inputs[0].value, inputs[1].value, inputs[2].value);
}

/**
 * Edits an existing contact by removing the old entry and adding a new one with updated information.
 */
function editContact() {
    removeContact();
    addContact(inputs[0].value, inputs[1].value, inputs[2].value);
}

/**
 * Adds a contact to the contacts array.
 * @param {String} contactName 
 * @param {String} contactPhone 
 * @param {String} contactMail 
 */
function addContact(contactName, contactPhone, contactMail) {
    const contact = {
        id: 0, 
        name: contactName,
        phone: contactPhone,
        mail: contactMail,
        initials: getInitials(contactName)
    };

    contacts.push(contact); // Add the new contact to the contacts array.
    sortContacts(); // Sort the contacts array alphabetically by name.
    clearInputs(); // Clear input fields in the add/edit contact popup.
    toggleAddContactPopup(); // Close the add/edit contact popup.
    displayContactInfos(contact.id); // Display the added/edited contact's information.
}

/**
 * Displaying the current Added UserInfo
 * @param {String} contactName 
 */
function searchContact(contactName) {
    for(let i = 0; i < contacts.length; i++){
        let contact = contacts[i];

        if(contact.name === contactName){
            displayContactInfos(contact.id)
        }
    }
}

/**
 * Sorts the contacts array alphabetically by the contact's name.
 */
function sortContacts() {
    contacts.sort((a, b) => {
        let nameA = a.name.toUpperCase();
        let nameB = b.name.toUpperCase(); 
    
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        return 0;
    });

    createContactId();
    createContact();
    saveData();
}

/**
 * Assigns a unique ID to each contact in the contacts array.
 */
function createContactId() {
    contacts.forEach((contact, id) => {
        contact.id = id;
    })
}

/**
 * Generates the HTML content for each contact in the contacts array and displays it in the UI.
 */
function createContact() {
    const contactsElement = document.querySelector(".contacts");
    contactsElement.innerHTML = "";
    let firstLetter = "";

    for(let i = 0; i < contacts.length; i++){
        let contact = contacts[i];
        if(firstLetter !== contact.initials[0]){
            firstLetter = contact.initials[0];
            contactsElement.innerHTML += createFirstLetterBoxHTML(firstLetter);
        }
        let newContactElement = createContactHTML(contact);
        contactsElement.innerHTML += newContactElement;
    }
}

/**
 * Extracts the initials from a given full name.
 * @param {String} contactName The full name of the contact.
 * @returns {String} The initials of the contact.
 */
function getInitials(contactName) {
    const nameArray = contactName.split(" ");
    const initials = [];

    nameArray.forEach((name) => {
        let firstletter = name.slice(0, 1);
        initials.push(firstletter.toUpperCase());
    })

    if(initials.length > 2){
        initials.splice(2, initials.length)
    }
    return initials.join("");
}

/**
 * Clears all input fields in the contact form.
 */
function clearInputs() {
    document.getElementById("newContactName").value = "";
    document.getElementById("newContactPhone").value = "";
    document.getElementById("newContactMail").value = "";
}

/**
 * Displays detailed information about a specific contact in the contact information section of the UI.
 * @param {number} id The unique ID of the contact whose information is to be displayed.
 */
function displayContactInfos(id) {
    const contactInitials = document.getElementById("contactInitials");
    const contactName = document.getElementById("contactName");
    const contactMail = document.getElementById("contactMail");
    const contactNumber = document.getElementById("contactNumber");
    const idElement = document.getElementById("idBox");
    toggleContactArea(true);
    activeContact(id);

    contactInitials.innerHTML = contacts[id].initials;
    contactName.innerHTML = contacts[id].name;
    contactMail.innerHTML = contacts[id].mail;
    contactNumber.innerHTML = contacts[id].phone;
    idElement.innerText = id;
    editContactButton.onclick = function () {
        toggleAddContactPopup();
        fillPopupInputs(id);
        toggleContactPopup("edit");
    };
}

/**
 * Toggles the visibility of the contact information section in the UI.
 * @param {boolean} display Specifies whether to show or hide the contact information section.
 */
function toggleContactArea(display) {
    elements.forEach(element => {
        if (element) {
            element.classList.toggle("d-none", !display);
        }
    });
}

/**
 * Fills the input fields in the contact form with the information of a specific contact.
 * @param {number} id The unique ID of the contact whose information is to fill the form.
 */
function fillPopupInputs(id) {
    const nameInput = document.getElementById("newContactName");
    const phoneInput = document.getElementById("newContactPhone");
    const mailInput = document.getElementById("newContactMail");

    nameInput.value = contacts[id].name;
    phoneInput.value = contacts[id].phone;
    mailInput.value = contacts[id].mail;
}

/**
 * Toggles the UI between the add and edit states of the contact form.
 * @param {string} mode Specifies whether the form is in 'add' or 'edit' mode.
 */
function toggleContactPopup(mode) {
    const popupHeading = document.querySelector(".addContactPopup h3");

    if (mode === "edit") {
        popupHeading.innerText = "Edit Contact";
        actionButton.innerText = "Edit Contact";
        actionButton.classList.add("edit");
    } else if (mode === "add") {
        popupHeading.innerText = "Add Contact";
        actionButton.innerText = "Create Contact";
        actionButton.classList.remove("edit");
    }
}

/**
 * Removes a contact from the contacts array based on its ID.
 */
function removeContact() {
    const contactID = parseInt(document.getElementById("idBox").innerText, 10);
    contacts.splice(contactID, 1);
}

/**
 * Removes the 'activeBox' class from all contacts, effectively de-highlighting them in the UI.
 */
function deactivateAllContacts() {
    let contactList = document.querySelectorAll(".contactBox");
    contactList.forEach((contact) => {
        contact.classList.remove("activeBox")
    })
}

/**
 * Adds the 'activeBox' class to a specific contact, highlighting it in the UI.
 * @param {number} ID The unique ID of the contact to be highlighted.
 */
function activeContact(ID){
    const contactList = document.querySelectorAll(".contactBox");
    contactList.forEach((contact, id) => {
        if(ID === id){
            contact.classList.add("activeBox")
        }
    })
}



// Adding Event Listener

/**
 * Click event to Display Popup
 */
addContactButton.addEventListener("click", (event) => {
    event.preventDefault();
    toggleAddContactPopup();
    toggleContactPopup("add");
})

/**
 * Close addContactPopup
 */
document.querySelector(".contactPopupClose").addEventListener("click", () => {
    toggleAddContactPopup();
    clearInputs();
})

/**
 * Close Popup if overlay(background) is clicked
 */
document.addEventListener("click", (event) => {
    if(event.target.classList.contains("overlay")){
        toggleAddContactPopup();
        clearInputs();
    }
})

/**
 * Adding the background of Active Contact
 */
document.addEventListener("click", (event) => {
    const contactBox = event.target.closest(".contactBox");
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    const contactInformation = document.querySelector(".contactInformation");

    if(contactBox){
        deactivateAllContacts()
        contactBox.classList.add("activeBox")
    }

    if(contactBox && mediaQuery){
        contactInformation.style.display = "block";
    }
})

/**
 * Close Contact Information on Mobile Screen
 */
document.querySelector(".closeContactIcon").addEventListener("click", () => {
    const contactInformation = document.querySelector(".contactInformation");

    contactInformation.style.display = "none";
})

/**
 * Click event for Edit or Create Button
 */
actionButton.addEventListener("click", (event) => {
    event.preventDefault();
    if(!actionButton.classList.contains("edit")){
        checkInputs(addNewContact);
    }

    if(actionButton.classList.contains("edit")){
        removeOrAddContact();
    }
})

/**
 * Click event to display user Infos on the right side
 */
document.querySelector('.contacts').addEventListener('click', (event) => {
    const contactBox = event.target.closest('.contactBox');
    if (contactBox) {
        const id = contactBox.getAttribute('data-id');
        displayContactInfos(id);
    }
});



// Create HTML Elements

/**
 * Creates HTML Structure of a Contact
 * @param {Object} contact 
 * @returns HTMLString
 */
function createContactHTML(contact) {
    const id = contact.id;
    
    return `<div class="contactBox" data-id="${id}">
                <div class="contactInitlians">${contact.initials}</div>
                <div class="contactBoxInfo">
                    <div class="contactBoxName">${contact.name}</div>
                    <div class="contactBoxMail">${contact.mail}</div>
                </div>
            </div>`;
}

/**
 * Creates HTML Structure of the firstLetter Element
 * @param {String} firstLetter 
 * @returns HTMLString
 */
function createFirstLetterBoxHTML(firstLetter) {
    return `<div class="firstLetterBox">${firstLetter}</div>`
}






// Local Storage

function loadData() {
    const storedTodos = localStorage.getItem('contacts');
    if (storedTodos) {
        contacts = JSON.parse(storedTodos);
    }
}

function saveData() {
    localStorage.setItem('contacts', JSON.stringify(contacts));
}