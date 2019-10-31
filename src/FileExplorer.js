import React from 'react';
import Directory from './Directory'
import DirectoryTable from './DirectoryTable';
import Menu from './Menu';


export default class FileExplorer extends React.Component {
  constructor(props) {
    super(props)
    const { ipc, path } = this.props
    // The main electron process is handling all requests for files, so send a request for the home directory initially.
    // let fyles = ipc.sendSync('request files from directory', path || os.homedir());
    // Here we want to sort the files so that directories are on top of files
    // fyles = fyles.sort((a, b) => {
    //   if (a.type === 'Directory') {
    //     return -1
    //   } else {
    //     return 1
    //   }
    // })
    this.state = {
      // files: fyles,
      condensed: true,
    }
  }

  toggleView() {
    const { condensed } = this.state
    if (condensed) {
      this.setState({
        condensed: false,
      })
    } else {
      this.setState({
        condensed: true,
      })
    }

  }

  renderFromType(file) {
    const { ipc } = this.props
    const { currentDirectory, condensed } = this.state
    return (
      <Directory
        key={file.name}
        file={file}
        ipc={ipc}
        path={`${currentDirectory}/${file.name}`}
        fileName={file.name}
        condensed={condensed}
      />
    )
  }

  render() {
    console.log("file explorer props", this.props)
    console.log("file explorer state", this.state)
    const { files, condensed, currentDirectory } = this.state
    const { ipc } = this.props
    return (
      <div>
        <Menu
          toggleView={this.toggleView.bind(this)}
          condensed={condensed}
        />
        { condensed ? (
          <DirectoryTable ipc={ipc} currentDirectory={currentDirectory} files={files} />
        ) : (
          // <div>uncondensed</div>
          <div style={{ display: 'flex', flexDirection: condensed ? 'column' : 'row', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
            { files.map(file => this.renderFromType(file)) }
          </div>
        )}
      </div>
    )
  }
}