export function sortFiles(files, sortColumn, sortDirection) {
  files = files.sort((a, b) => {
    let bool = getExpressionForColumn(sortColumn, sortDirection, a, b)
    if (bool) {
      return -1
    } else {
      return 1
    }
  })
  return files
}

function getExpressionForColumn(column, direction, a, b) {
  switch(column) {
    case 'name':
      a = a.name.toLowerCase()
      b = b.name.toLowerCase()
      return direction === 'asc' ? ascendingHelper(a, b) : descendingHelper(a, b)

    case 'type':
      a = a.type.toLowerCase()
      b = b.type.toLowerCase()
      return direction === 'asc' ? ascendingHelper(a, b) : descendingHelper(a, b)

    case 'size':
      a = parseInt(a.sizeInBytes)
      b = parseInt(b.sizeInBytes)
      return direction === 'asc' ? ascendingHelper(a, b) : descendingHelper(a, b)

    case 'statusChanged':
      a = Date.parse(`${a.statusChanged}`)
      b = Date.parse(`${b.statusChanged}`)
      return direction === 'asc' ? ascendingHelper(a, b) : descendingHelper(a, b)

    case 'lastModified':
      a = Date.parse(`${a.lastModified}`)
      b = Date.parse(`${b.lastModified}`)
      return direction === 'asc' ? ascendingHelper(a, b) : descendingHelper(a, b)

    case 'createdAt':
      a = Date.parse(`${a.createdAt}`)
      b = Date.parse(`${b.createdAt}`)
      return direction === 'asc' ? ascendingHelper(a, b) : descendingHelper(a, b)

    default:
      a = Date.parse(`${a.lastModified}`)
      b = Date.parse(`${b.lastModified}`)
      return descendingHelper(a, b)
  }
}

function ascendingHelper(a, b) {
  return (a < b)
}

function descendingHelper(a, b) {
  return (a > b)
}