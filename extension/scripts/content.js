// Read from prompt
function restorePrompt() {
  return new Promise(function(resolve, reject) {
      chrome.storage.sync.get(function(items) {
        savedInstruction = items.savedInstruction;
        //If user hasn't set prompt, reject and do nothing.
        (savedInstruction)? resolve() : reject();
      });
  });    
}

showLoadingCursor();
// Replace Text
var elements = document.getElementsByTagName('*');
for (var i = 0; i < elements.length; i++) {
    var element = elements[i];

    for (var j = 0; j < element.childNodes.length; j++) {
        var node = element.childNodes[j];

        if (node.nodeType === 3) {
            var text = node.nodeValue;
            console.log(text)

            fetch("http://localhost:3000", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ message: text }),
            })
              .then((response) => response.json())
              .then(async (data) => {
                // Use original text element and fallback to current active text element
                element.replaceChild(document.createTextNode(data.reply), node);
                //TODO: need to save id here?
                }
              ).catch((error) => {
                restoreCursor();
                alert(
                  "Error. Make sure you're running the server by following the instructions on https://github.com/gragland/chatgpt-chrome-extension. Also make sure you don't have an adblocker preventing requests to localhost:3000."
                );
                throw new Error(error);
              });
              
            
        }
    }
};
restoreCursor();


const showLoadingCursor = () => {
  const style = document.createElement("style");
  style.id = "cursor_wait";
  style.innerHTML = `* {cursor: wait;}`;
  document.head.insertBefore(style, null);
};

const restoreCursor = () => {
  document.getElementById("cursor_wait").remove();
};
