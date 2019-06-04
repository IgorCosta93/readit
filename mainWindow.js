const {BrowserWindow} = require('electron')
let mainWindow

function createWindow () {
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      },
      icon: `${__dirname}/icons/64x64.png`//Only need for linux
    })
  
    mainWindow.loadFile(`./renderer/main.html`)
  
    mainWindow.on('closed', function () {
      mainWindow = null
    })
}

module.exports = { createWindow }
