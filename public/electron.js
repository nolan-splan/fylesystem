const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const isDev = require('electron-is-dev');
const fs = require('fs');
const os = require('os');
const ipc = electron.ipcMain;
const Menu = electron.Menu
const MenuItem = electron.MenuItem

// The client should initially request the home directory of the user's operating system.
ipc.on('request files from directory', (event, path) => {

  // Print the path being requested
  console.log("---------- ARGS ----------")
  console.log(path)

  fs.readdir(path, (err, files) => {
    if (err) {
      throw err;
    } else {
      console.log('found files: ', files)
      // Create a new Object so we can send back additional data about the files/directories
      const data = mapFileData(path, files)
      console.log('returning data: ', data)
      event.returnValue = data
    }
  })
});

function getFileTypeFromStats(stats) {
  if (stats.isDirectory()) {
    return 'Directory';
  } else if (stats.isFile()) {
    return 'File';
  } else if (stats.isSymbolicLink()) {
    return 'SymLink';
  } else {
    return 'Unknown'
  }
}
function mapFileData(path, files) {
  const data = files.map(function(filename) {
    // get the stats for each file
    const fileStats = fs.lstatSync(`${path}/${filename}`);
    const returnObject = {};
    returnObject['name'] = filename;
    returnObject['type'] = getFileTypeFromStats(fileStats);
    returnObject['sizeInBytes'] = fileStats.size.toString(10);
    returnObject['lastModified'] = fileStats.mtime;
    returnObject['statusChanged'] = fileStats.ctime;
    returnObject['createdAt'] = fileStats.birthtime;
    return returnObject;
  })
  return data;
}

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    webPreferences: {
      nodeIntegration: true
    }
  });
  if (isDev) {
    console.log('loading localhost')
  } else {
    console.log('loading index.html')
  }
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => mainWindow = null);
}

function getUserFiles() {
  console.log(os.platform());
  console.log(os.homedir());
  const homedir = os.homedir();
  fs.readdir(homedir, (err, files) => {
    if (err) {
      throw err;
    } else {
      console.log('getUserFiles returning: ', files)
      return files
    }
  })
}

app.on('ready', () => {
  createWindow()
  const ctxMenu = new Menu()
  ctxMenu.append(new MenuItem({
    label: 'Open',
    click: function() {
      console.log()
    }
  }))

  mainWindow.webContents.on('context-menu', function(e, params){
    ctxMenu.popup(mainWindow, params.x, params.y)
  })
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';