// background.js
importScripts('lame.min.js');

let audioContext;
let mediaRecorder;
let audioPort;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "startCapture") {
    startAudioCapture();
  } else if (request.message === "stopCapture") {
    stopAudioCapture();
  }
});

// Establish a connection with the content script
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
        // Combine audio chunks into a single Blob
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });

        // Convert audioBlob to MP3 using lamejs
        const mp3Encoder = new lamejs.Mp3Encoder(1, audioContext.sampleRate, 128);
        const buffer = new Int16Array(audioBlob.arrayBuffer());
        const mp3Data = [];
        let mp3buf;

        while (buffer.length) {
          mp3buf = mp3Encoder.encodeBuffer(buffer);
          if (mp3buf.length > 0) {
            mp3Data.push(mp3buf);
          }
        }

        mp3buf = mp3Encoder.flush();
        if (mp3buf.length > 0) {
          mp3Data.push(mp3buf);
        }

        // Concatenate all the MP3 data into a single Blob
        const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' });

        // Save the MP3 Blob as a file
        const url = URL.createObjectURL(mp3Blob);
        const a = document.createElement('a');
        document.body.appendChild(a);
        a.style = 'display: none';
        a.href = url;
        a.download = 'captured_audio.mp3';
        a.click();
        window.URL.revokeObjectURL(url);
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
