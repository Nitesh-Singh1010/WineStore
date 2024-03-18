import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Paper,
} from '@mui/material'
import CustomTablePagination from '../CustomTablePagination/CustomTablePagination'
import './CommonTable.scss'
export interface Column {
  id: string
  label: string
  sortable?: boolean
  filterable?: boolean
  customSort?: (a: any, b: any) => number
  dataType?: 'string' | 'number' | 'date' // Add this line
}

interface CommonTableProps {
  rows: any[]
  columns: Column[]
}

const CommonTable: React.FC<CommonTableProps> = ({ rows, columns }) => {
  const [orderBy, setOrderBy] = useState<string>('')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [searchText, setSearchText] = useState<string>('')
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)
  const [jumpToPage, setJumpToPage] = useState<number>(1)

  const handleSort = (
    property: string,
    customSort?: (a: any, b: any) => number
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrderBy(property)
    setOrder(isAsc ? 'desc' : 'asc')
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
    setPage(0)
  }

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  )
  const sortedRows = filteredRows.slice().sort((a, b) => {
    const column = columns.find((col) => col.id === orderBy)
    if (column?.customSort) {
      return order === 'asc'
        ? column.customSort(a, b)
        : -column.customSort(a, b)
    } else {
      if (column?.dataType === 'date') {
        const dateA = new Date(a[orderBy]).getTime()
        const dateB = new Date(b[orderBy]).getTime()
        return order === 'asc' ? dateA - dateB : dateB - dateA
      } else {
        return order === 'asc'
          ? a[orderBy] - b[orderBy]
          : b[orderBy] - a[orderBy]
      }
    }
  })

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleJumpToPage = () => {
    if (
      jumpToPage >= 1 &&
      jumpToPage <= Math.ceil(filteredRows.length / rowsPerPage)
    ) {
      setPage(jumpToPage - 1)
    } else {
      alert('Invalid Page number.')
      console.error('Invalid page number')
    }
  }

  return (
    <>
      <TableContainer component={Paper}>
        <TextField
          variant="standard"
          placeholder="Search to Filter Rows"
          value={searchText}
          onChange={handleSearch}
          className="commonTable-search"
        />
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.id === 'remainingAmount' ? 'right' : 'left'}
                >
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.id}
                      direction={orderBy === column.id ? order : 'asc'}
                      onClick={() => handleSort(column.id, column.customSort)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index} className="commonTableRow">
                  {columns.map((column) => {
                    let cellContent = row[column.id]

                    if (column.dataType === 'date' && cellContent) {
                      const dateObj = new Date(cellContent)
                      if (!isNaN(dateObj.getTime())) {
                        cellContent = dateObj.toLocaleDateString()
                      }
                    } else if (
                      cellContent === undefined ||
                      cellContent === null
                    ) {
                      cellContent = ''
                    }

                    return (
                      <TableCell
                        key={column.id}
                        align={
                          column.id === 'remainingAmount' ? 'right' : 'left'
                        }
                      >
                        {cellContent}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <CustomTablePagination
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          handleChangePage={handleChangePage}
          jumpToPage={jumpToPage}
          setJumpToPage={setJumpToPage}
          handleJumpToPage={handleJumpToPage}
        />
      </TableContainer>
    </>
  )
}

export default CommonTable
