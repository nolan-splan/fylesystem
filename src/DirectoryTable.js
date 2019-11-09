import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { sortFiles } from './SortHelper'
const os = window.require('os');
const fs = window.require('fs');
// const cp = window.require('child_process');
const path = window.require('path');
const open = window.require('open');


export default class DirectoryTable extends React.Component {
  constructor(props) {
    super(props)
    const { ipc, currentDirectory } = props
    const sortColumn = 'name'
    const sortDirection = 'asc'
    let fyles = ipc.sendSync('request files from directory', currentDirectory || os.homedir());
    // use SortHelper library to sort files
    // sort by name ascending by default
    fyles = sortFiles(fyles, sortColumn, sortDirection)
    this.state = {
      files: fyles,
      currentDirectory: currentDirectory || os.homedir(),
      sortColumn: sortColumn,
      sortDirection: sortDirection,
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

  changeDirectory(filepath, up) {
    const { ipc } = this.props
    const { currentDirectory, sortColumn, sortDirection } = this.state
    let newPath;
    if (up) {
      newPath = path.dirname(filepath).split(path.sep).join('/')
    } else {
      newPath = `${currentDirectory}/${filepath}`
    }
    let fyles = ipc.sendSync('request files from directory', `${newPath}`);
    // should keep sorting through changing directory, use state?
    fyles = sortFiles(fyles, sortColumn, sortDirection)
    this.setState({
      currentDirectory: newPath,
      previousDirectory: currentDirectory,
      files: fyles,
    })
  }

  headerClicked(files, column, direction) {
    files = sortFiles(files, column, direction)
    this.setState({
      files: files,
      sortColumn: column,
      sortDirection: direction
    })
  }

  handleRowClicked(row) {
    if (row.type === 'Directory') {
      this.changeDirectory(row.name);
    } else if (row.type === 'File') {
      this.openFile(row.name);
    } else {
      return null
    }
  }

  openFile(filename) {
    const { currentDirectory } = this.state
    open(`${currentDirectory}/${filename}`)
  }

  renderTableHead(columns) {
    const { files, sortDirection, sortColumn } = this.state
    return (
      <TableHead>
        <TableRow>
          {columns.map(column => (
            <TableCell
              key={column.id}
              align={column.align}
              style={{ minWidth: column.minWidth }}
              onClick={ () => this.headerClicked(files, column.id, sortDirection === 'asc' ? 'desc' : 'asc') }
            >
              {column.label}
              { sortColumn === column.id && (<i m={0} className="material-icons">{sortDirection === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down'}</i>) }
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    )
  }

  renderTableBody(rows, columns) {
    return (
      <TableBody>
        {rows.map(row => {
          return (
            <TableRow hover role="checkbox" tabIndex={-1} key={row.name} onClick={() => this.handleRowClicked(row)}>
              {columns.map(column => {
                const value = row[column.id];
                return (
                  <TableCell onContextMenu={() => console.log('Right Click')} key={column.id}>
                    {value}
                    { column.label === 'Name' && row.type === 'File' && (
                      <i style={{ float: 'right' }} className="material-icons" onClick={() => fs.open(row.name, 'w', (err, file) => console.log('opening file'))}>
                        edit
                      </i>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    )
  }

  renderBackButton() {
    const { currentDirectory } = this.state
    return (
      <button className="up-directory" onClick={() => this.changeDirectory(currentDirectory, true)}>
      <i className="material-icons">
        arrow_back
      </i>
    </button>
    )
  }

  render() {
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
          { previousDirectory && this.renderBackButton() }
          <h3 style={{margin: 0}}>{currentDirectory}</h3>
        </div>
        <div className={classes.tableWrapper}>
          <Table stickyHeader aria-label="sticky table">
            { columns && this.renderTableHead(columns) }
            { rows && columns && this.renderTableBody(rows, columns) }
          </Table>
        </div>
      </Paper>
    )
  }
}