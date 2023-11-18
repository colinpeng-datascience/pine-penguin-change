// Create a context menu item
chrome.contextMenus.create({
  id: "translate-content",
  title: "Translate Content",
  contexts: ["all"],
});

// Listen for when the user clicks on the context menu item
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translate-content") {
    // Send a message to the content script
    chrome.tabs.sendMessage(tab.id, { type: "TRANSLATE_CONTENT" });
  }
});
