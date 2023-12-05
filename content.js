// content.js

let audioContext;
let mediaRecorder;
let audioPort;

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.command === "startCapture") {
    startAudioCapture();
  } else if (request.command === "stopCapture") {
    stopAudioCapture();
  }
});

// Establish a connection with the background script
audioPort = chrome.runtime.connect({ name: "audioPort" });

function startAudioCapture() {
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(function (stream) {
      audioContext = new AudioContext();
      const audioInput = audioContext.createMediaStreamSource(stream);
      mediaRecorder = new MediaRecorder(audioContext.createMediaStreamDestination());

      audioInput.connect(mediaRecorder);

      const audioChunks = [];

      mediaRecorder.ondataavailable = function (event) {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = function () {
        // Send audio data to the background script
        audioPort.postMessage({ audioData: audioChunks });
      };

      mediaRecorder.start();
    })
    .catch(function (error) {
      console.error('Error capturing audio:', error);
    });
}

function stopAudioCapture() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    audioContext.close();
  }
}
