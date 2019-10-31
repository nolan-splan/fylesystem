import React from 'react';
import './App.css';
import FileExplorer from './FileExplorer';
const ipc = window.require('electron').ipcRenderer;
const os = window.require('os')

export default class App extends React.Component {
  constructor(props) {
    super(props)
    const { path } = this.props
    this.state = {
      currentDirectory: path || os.homedir(),
    }
  }
  render() {
    return (
      <div className="App">
        <div id="file-browser-container">
          <FileExplorer ipc={ipc}/>
        </div>
      </div>
    )
  }
}

// export default App;
