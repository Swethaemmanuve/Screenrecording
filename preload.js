const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  getSources: async () => await ipcRenderer.invoke("get-sources")
});
