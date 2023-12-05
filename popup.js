// popup.js
let audioPort;

document.getElementById('startCapture').addEventListener('click', startCapture);
document.getElementById('stopCapture').addEventListener('click', stopCapture);

async function startCapture() {
  // Send a message to background.js to start audio capture
  chrome.runtime.sendMessage({ message: "startCapture" });
}

function stopCapture() {
  // Send a message to background.js to stop audio capture
  chrome.runtime.sendMessage({ message: "stopCapture" });
}
