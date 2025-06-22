import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('electron', {
  // expose API if needed
})
