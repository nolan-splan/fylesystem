import React from 'react'
export default class File extends React.Component {
  render() {
    const { fileName, condensed } = this.props
    return (
      condensed ? (
        <div style={{ display: 'flex', borderTop: '1px solid black'}} key={fileName}>
          <i className="material-icons">
            insert_drive_file
          </i>
          {fileName}
        </div>
      ) : (
        <div>uncondensed</div>
      )
    )
  }
}