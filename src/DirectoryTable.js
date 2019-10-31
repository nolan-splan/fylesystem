import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { sortFiles } from './SortHelper'
const os = window.require('os');

export default class DirectoryTable extends React.Component {
  constructor(props) {
    super(props)
    const { ipc, currentDirectory } = props

    let fyles = ipc.sendSync('request files from directory', currentDirectory || os.homedir());
    // use SortHelper library to sort files
    fyles = sortFiles(fyles)
    this.state = {
      files: fyles,
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
    const { currentDirectory, previousDirectory, sortColumn, sortDirection } = this.state
    path = path === previousDirectory ? path : `${currentDirectory}/${path}`
    let fyles = ipc.sendSync('request files from directory', `${path}`);
    // should keep sorting through changing directory, use state?
    // use state when the user manually sorts
    fyles = sortFiles(fyles, sortColumn, sortDirection)
    this.setState({
      currentDirectory: path,
      previousDirectory: currentDirectory,
      files: fyles,
    })
  }

  renderTableHead(columns) {
    return (
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
    )
  }

  renderTableBody(rows, columns) {
    return (
      <TableBody>
        {rows.map(row => {
          return (
            <TableRow hover role="checkbox" tabIndex={-1} key={row.name} onClick={() => this.changeDirectory(`${row.name}`)}>
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
    )
  }

  renderBackButton() {
    const { previousDirectory } = this.state
    return (
      <button className="up-directory" onClick={() => this.changeDirectory(previousDirectory)}>
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