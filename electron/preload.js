// Preload minimal — pode ser expandido para expor APIs seguras via contextBridge.
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('brzil', {
  // Placeholder: se quiser expor APIs nativas, adicione aqui
});
