// This class currently represents Files, Directories, and Symbolic Links
// The file object is included in the props to this class
// Use .type attribute on file object to render differnt components
import React from 'react';
import FileExplorer from './FileExplorer';
export default class Directory extends React.Component {
  constructor(props) {
    super(props)
    const { condensed } = this.props
    this.state = {
      expanded: false,
      condensed: condensed,
    }
  }

  handleClicked() {
    const { path, ipc } = this.props
    const { expanded } = this.state
    this.toggleDirectory()
    if (!expanded) {
      let fyles = ipc.sendSync('request files from directory', path);
      this.setState({
        files: fyles
      })
    }
  }
  toggleDirectory() {
    const { expanded } = this.state
    this.setState({
      expanded: !expanded,
    })
  }

  render() {
    const { fileName, path, ipc, condensed } = this.props
    const { expanded, files } = this.state
    return (
      condensed ? (
        <div
          className="row"
          style={{ display: 'flex'}}
          key={fileName}
        >
          <i onClick={() => this.handleClicked()} className="material-icons">
            { expanded ? 'expand_more' : 'chevron_right' }
          </i>
          {fileName}
          <div
            style={{ display: 'flex', marginLeft: '-3rem', marginTop: '2rem' }}
          >
            { expanded && files.length > 0 && (
              <FileExplorer ipc={ ipc } path={ path } />
            )}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, flexBasis: '25%', flexDirection:'col', height: 100}}>
          <i style={{ width: '100%' }} className="material-icons">
            folder_open
          </i>
          <p style={{margin: 0}}>{fileName}</p>
        </div>
      )
    )
  }
}