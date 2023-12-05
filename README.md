# Audio Capture Extension

This Chrome extension allows users to capture audio from the browser using the Web Audio API. It converts the captured audio into an MP3 file and enables the user to download the resulting audio.

## How to Use

1. Click on the extension icon in the toolbar.
2. Click the "Start Audio Capture" button to begin capturing audio.
3. Click the "Stop Audio Capture" button to stop capturing audio.
4. A downloadable MP3 file named "captured_audio.mp3" will be generated.

## Logic and Components

- **`manifest.json`**: Configuration file for the extension.

- **`popup.html`**: Popup HTML with buttons to start and stop audio capture.

- **`popup.js`**: JavaScript for the popup, sends messages to `background.js` to control audio capture.

- **`background.js`**: Background script that handles audio capture, converts audio to MP3, and provides a download link.

- **`content.js`**: Content script that interacts with the webpage, captures audio, and sends data to `background.js`.

- **`lame.min.js`**: External library for MP3 encoding.

## Note

Ensure that you have granted permission to access the microphone when prompted.

