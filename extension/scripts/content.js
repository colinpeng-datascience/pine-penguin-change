let conversationId;
let parentMessageId;

function getConversationId() {
    return new Promise(function(resolve, reject) {
        chrome.storage.sync.get(function(items) {
            conversationId = items.conversationId;
            parentMessageId = items.parentMessageId;
            (parentMessageId && conversationId)? resolve() : reject();
        });
    });    
}

// to filter our things that probably don't need to be transformed (pure symbols, pure numbers etc)
function testCommonText(input) {
    const regex = /^[^\{\}]*$/;
    const invalidPattern = /^[\d\s\.\•\…\:\·\,\+\-\%\*\/\(\)]*$/; // Include additional characters if needed

    const isSingleCharacterOrSymbol = /^[a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]$/;
    const isURL = /^(https?|http).*(\.org|\.com)$/;

    return regex.test(input) && !invalidPattern.test(input) && !isSingleCharacterOrSymbol.test(input) && !isURL.test(input);
}

async function transformText(text) {
    let newtext = text;
    let textWasChanged = false;
    if (typeof text == 'string' & testCommonText(text)) {
        textWasChanged = true;
        newtext = await fetch("http://localhost:3000", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: text , conversationId: conversationId, parentMessageId: parentMessageId}),
        })
            .then((response) => response.json())
            .then(async (data) => {
            return data.reply;
            }
            ).catch((error) => {
            alert(
                "Error. Make sure you're running the server by following the instructions on https://github.com/colinpeng-datascience/internet-for-kids. Also make sure you don't have an adblocker preventing requests to localhost:3000."
            );
            throw new Error(error);
            });
    }
    return [textWasChanged, newtext];
}

async function transformTextInTextNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
    let data = node.data;
    [textWasChanged, changedText] = await transformText(data);
    if (textWasChanged) {
        node.replaceData(0, data.length, changedText);
    }}
}


async function transformTextOnNodes(nodes) {
    nodes.forEach(async (node) => {
        await transformTextInTextNode(node);
        node.childNodes.forEach((childNode) => {
            transformTextInTextNode(childNode);
            if (typeof childNode.childNodes == 'object') {
                transformTextOnNodes(childNode.childNodes);
            }
        });
    });
}

function transformTextOnPageLoad() {
    transformTextOnNodes(document.querySelectorAll('body'));
}

function startObserving(observer) {
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter:  ["value"]});
}

function transformTextOnPageChange() {
    const observer = new MutationObserver(async function(mutations) {
        //prevent infinite loop, await is also important here for the same purpose
        observer.disconnect();
        await Promise.all(mutations.map(async (mutation) => {
            switch(mutation.type) {
                case 'childList':
                    await transformTextOnNodes(mutation.addedNodes);
                    break;
                case 'characterData':
                    await transformTextInCharacterData(mutation.target);
                    break;
            }
        }));
          
        startObserving(observer);
    });
    
    startObserving(observer);
}

getConversationId()

.then(function() {
    transformTextOnPageLoad();
    transformTextOnPageChange();
})

.catch(function() {});