import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
const os = window.require('os');

export default class DirectoryTable extends React.Component {
  constructor(props) {
    super(props)
    const { ipc, currentDirectory } = props

    let fyles = ipc.sendSync('request files from directory', currentDirectory || os.homedir());
    // Here we want to sort the files so that directories are on top of files
    fyles = fyles.sort((a, b) => {
      if (a.type === 'Directory') {
        return -1
      } else {
        return 1
      }
    })
    this.state = {
      files: fyles,
      // condensed: true,
      currentDirectory: currentDirectory || os.homedir(),
    }
  }
  createData(name, type, size, statusChanged, lastModified, createdAt) {
    return { name, type, size, statusChanged, lastModified, createdAt}
  }

  classes() {
    return {
      root: {
        width: '100%',
      },
      tableWrapper: {
        maxHeight: 440,
        overflow: 'auto',
      },
      aboveTable: {
        display: 'flex',
        height: '500px',
      },
    }
  }

  changeDirectory(path) {
    const { ipc } = this.props
    const { currentDirectory } = this.state
    let fyles = ipc.sendSync('request files from directory', path);
    console.log(fyles)
    this.setState({
      currentDirectory: path,
      previousDirectory: currentDirectory,
      files: fyles,
    })
  }

  render() {
    console.log("props", this.props)
    console.log("state", this.state)
    // const { files } = this.props
    const { files } = this.state
    const { previousDirectory, currentDirectory } = this.state
    const classes = this.classes()
    const columns = [
      { id: 'name', label: 'Name', minWidth: 170 },
      { id: 'type', label: 'Type', minWidth: 170 },
      { id: 'size', label: 'Size', minWidth: 170, format: value => value.toLocaleString() },
      { id: 'statusChanged', label: 'Status Changed At', minWidth: 170 },
      { id: 'lastModified', label: 'Last Modified At', minWidth: 170 },
      { id: 'createdAt', label: 'Created At', minWidth: 170 },
    ]
    const rows = files.map(file => {
      return this.createData(file.name, file.type, file.sizeInBytes, new Date(file.statusChanged).toLocaleString(), new Date(file.lastModified).toLocaleString(), new Date(file.createdAt).toLocaleString())
    })
    return (
      <Paper>
        <div className="above-table">
          <button className="up-directory" onClick={() => this.changeDirectory(previousDirectory)}>
            <i className="material-icons">
              arrow_back
            </i>
          </button>
          <h3 style={{margin: 0}}>{currentDirectory}</h3>
        </div>
        <div className={classes.tableWrapper}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.name} onClick={() => this.changeDirectory(`${currentDirectory}/${row.name}`)}>
                    {columns.map(column => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id}>
                          {value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Paper>
    )
  }
}