chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.ext === "Geargeargear") {
    const url = chrome.runtime.getURL("js/connector.js");
    const s = document.createElement("script");
    s.src = url;
    s.onload = () => {
      s.remove();
      window.postMessage(msg, "*");
    };
    document.documentElement.appendChild(s);
  }
});
