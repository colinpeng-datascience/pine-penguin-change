// Save data to sync storage
function saveInstruction() {
    var instructionInput = document.getElementById('instructionInput').value;
    chrome.storage.sync.set({ 'savedInstruction': instructionInput}, function() {
        console.log('Instruction saved successfully');
    });

    if (instructionInput == ""){
        chrome.storage.sync.set({ 'conversationId': ""}, function() {
            console.log('conversationId cleared');
        });
        chrome.storage.sync.set({ 'parentMessageId': ""}, function() {
            console.log('parentMessageId cleared');
        });
    }
    else{
        showLoadingCursor();
        // Save the instruction to sync storage
        
        fetch("http://localhost:3000", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: instructionInput }),
        })
            .then((response) => response.json())
            .then(async (data) => {
            chrome.storage.sync.set({ 'conversationId': data.conversationId}, function() {
                console.log('conversationId saved successfully');
            });
            chrome.storage.sync.set({ 'parentMessageId': data.parentMessageId}, function() {
                console.log('parentMessageId saved successfully');
            });
            }
            ).catch((error) => {
            restoreCursor();
            alert(
                "Error. Make sure you're running the server by following the instructions on https://github.com/colinpeng-datascience/pine-penguin-change. Also make sure you don't have an adblocker preventing requests to localhost:3000."
            );
            throw new Error(error);
            });
            restoreCursor();
    }

    // Update the displayed instruction
    displaySavedInstruction();
    
}

// Retrieve data from sync storage
function displaySavedInstruction() {
    // Retrieve the saved instruction from sync storage
    chrome.storage.sync.get(['savedInstruction'], function(result) {
        var savedInstruction = result.savedInstruction;
        var savedInstructionsList = document.getElementById('savedInstructions');
        savedInstructionsList.innerHTML = '';

        if (savedInstruction) {
            var listItem = document.createElement('li');
            listItem.textContent = savedInstruction;
            savedInstructionsList.appendChild(listItem);
        }
    });
}

// Display saved instruction when the page loads
displaySavedInstruction();


const showLoadingCursor = () => {
    const style = document.createElement("style");
    style.id = "cursor_wait";
    style.innerHTML = `* {cursor: wait;}`;
    document.head.insertBefore(style, null);
  };
  
const restoreCursor = () => {
document.getElementById("cursor_wait").remove();
};

document.addEventListener('DOMContentLoaded', function() {
// Your code to run after the DOM has loaded
var saveButton = document.getElementById('saveButton');

saveButton.addEventListener('click', function() {
    saveInstruction();
});

displaySavedInstruction();
});
  