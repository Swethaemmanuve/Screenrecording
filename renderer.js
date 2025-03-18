const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const preview = document.getElementById("preview");

let mediaRecorder;
let recordedChunks = [];

startBtn.addEventListener("click", async () => {
  try {
    const sources = await window.electron.getSources(); // Ensure the function is available
    if (!sources || sources.length === 0) {
      throw new Error("No screen sources found!");
    }

    const screenId = sources[0].id; // Capture the first screen
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        mandatory: {
          chromeMediaSource: "desktop",
          chromeMediaSourceId: screenId,
        },
      },
    });

    preview.srcObject = stream;
    mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    mediaRecorder.ondataavailable = (event) => recordedChunks.push(event.data);

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    };

    mediaRecorder.start();
    startBtn.disabled = true;
    stopBtn.disabled = false;
  } catch (error) {
    console.error("Error capturing screen:", error);
  }
});

stopBtn.addEventListener("click", () => {
  if (mediaRecorder) {
    mediaRecorder.stop();
    startBtn.disabled = false;
    stopBtn.disabled = true;
  }
});
