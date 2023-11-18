// Save data to sync storage
function saveInstruction() {
    var instructionInput = document.getElementById('instructionInput').value;

    // Save the instruction to sync storage
    chrome.storage.sync.set({ 'savedInstruction': instructionInput }, function() {
        console.log('Instruction saved successfully');
    });

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
