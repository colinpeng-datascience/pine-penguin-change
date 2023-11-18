let conversationId;
let parentMessageId;

/**
 * Restore the text to be changed.
 */
function restoreTextToChange() {
    return new Promise(function(resolve, reject) {
        chrome.storage.sync.get(function(items) {
            conversationId = items.conversationId;
            parentMessageId = items.parentMessageId;
            //console.log(conversationId);
            //If user hasn't set text to change on preference, reject and do nothing.
            (parentMessageId && conversationId)? resolve() : reject();
        });
    });    
}


/**
 * Indicates if the given text need to be changed.
 * @param {String} text Text to inspect
 */
function getChangedText(text) {
    console.log("getting changed text");
    let textWasChanged = false;
    if (typeof text == 'string') {
        console.log(text);
        textWasChanged = true;
        console.log("found a string");
        console.log(text);
        text = "ahhhh";
        fetch("http://localhost:3000", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: text , conversationId: conversationId, parentMessageId: parentMessageId}),
        })
            .then((response) => response.json())
            .then(async (data) => {
            // Use original text element and fallback to current active text element
            text = data.reply;
            console.log(text);
            //TODO: need to save id here?
            }
            ).catch((error) => {
            alert(
                "Error. Make sure you're running the server by following the instructions on https://github.com/gragland/chatgpt-chrome-extension. Also make sure you don't have an adblocker preventing requests to localhost:3000."
            );
            throw new Error(error);
            });
    }

    return [textWasChanged, text];
}

/**
 * Replaces text in common text on page.
 * @param {Node} node Node to search text to change
 */
function replaceTextInCharacterData(node) {
    let data = node.data;
    [textWasChanged, changedText] = getChangedText(data);
    if (textWasChanged) {
        node.replaceData(0, data.length, changedText);
    }
}


/**
 * Replaces text on input value attribute, that can be read on the page.
 * @param {Node} node Node to search text to change
 */
function replaceTextInInputValue(node) {
    if (node.nodeName.toUpperCase() == 'INPUT') {
        let text = node.getAttribute('value');

        [textWasChanged, changedText] = getChangedText(text);

        if (textWasChanged) {
            node.setAttribute('value', changedText);
        }
   }
}

/**
 * Replaces text on added nodes and on their children recursively.
 * @param {NodeList} nodes Nodes
 */
function replaceTextOnNodes(nodes) {
    nodes.forEach((node) => {
        replaceTextInCharacterData(node);
        replaceTextInInputValue(node);
        node.childNodes.forEach((childNode) => {
            replaceTextInCharacterData(childNode);
            replaceTextInInputValue(childNode);
            if (typeof childNode.childNodes == 'object') {
                replaceTextOnNodes(childNode.childNodes);
            }
        });
    });
}

/**
 * Replaces text on the first page load.
 */
function replaceTextOnPageLoad() {
    replaceTextOnNodes(document.querySelectorAll('body'));
}

/**
 * Start observing object for relevant changes.
 * @param {MutationObserver} observer Observer
 */
function startObserving(observer) {
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter:  ["value"]});
}

/**
 * Replaces text when the page change.
 */
function replaceTextOnPageChange() {
    const observer = new MutationObserver(function(mutations) {
        //The observer is disconnected to prevent infinite loop while changing text.
        observer.disconnect();
    
        mutations.forEach((mutation) => {
            switch(mutation.type) {
                case 'childList':
                    replaceTextOnNodes(mutation.addedNodes);
                    break;
                case 'attributes':
                    replaceTextInInputValue(mutation.target);
                    break;
                case 'characterData':
                    replaceTextInCharacterData(mutation.target);
                    break;
              }
          });
          
        startObserving(observer);
    });
    
    startObserving(observer);
}

restoreTextToChange()

.then(function() {
    replaceTextOnPageLoad();
    replaceTextOnPageChange();
})

.catch(function() {});