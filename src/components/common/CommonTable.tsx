import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

interface CommonTableProps {
  columns: Array<{
    id: string
    label: string
    component: (data: any, rowIndex?: number) => JSX.Element
    requestSort?: () => void
  }>
  rows: (string | number | null)[][]
  title: string
  sortConfig?: {
    key: string
    direction: 'asc' | 'desc'
  }
  requestSort?: (key: string) => void
}

const CommonTable: React.FC<CommonTableProps> = ({
  columns,
  rows,
  title,
  sortConfig,
  requestSort,
}) => {
  const getSortDirection = (columnId: string) => {
    if (!sortConfig || sortConfig.key !== columnId) return
    return sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽'
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} onClick={column.requestSort}>
                {column.label}
                {getSortDirection(column.id)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex}>
                  {columns[cellIndex].component(cell, rowIndex)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CommonTable
