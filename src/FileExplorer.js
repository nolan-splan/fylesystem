import React from 'react';
import Directory from './Directory'
import DirectoryTable from './DirectoryTable';
import Menu from './Menu';


export default class FileExplorer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
          <div style={{ display: 'flex', flexDirection: condensed ? 'column' : 'row', flexWrap: 'wrap', justifyContent: 'space-evenly'}}>
            { files.map(file => this.renderFromType(file)) }
          </div>
        )}
      </div>
    )
  }
}