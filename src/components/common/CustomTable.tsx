import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import Link from '@mui/material/Link'
import React from 'react'

export interface IColumn<T> {
  align?: 'inherit' | 'left' | 'center' | 'right' | 'justify'
  format?: (value: number) => string
  id: keyof T
  isHeader?: boolean
  isLink?: boolean
  label: string
  minWidth?: number
}

export interface ITableProps<T> {
  columns: Array<IColumn<T>>
  data: Array<T>
  isDense?: boolean
  maxHeight?: number
  stickyHeader?: boolean
  title: string
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: '1px solid #ccc',
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '0.725rem',
  },
}))

const CustomTable = <T extends object>({
  columns,
  data,
  isDense,
  maxHeight,
  stickyHeader,
  title,
}: ITableProps<T>) => {
  return (
    <Paper sx={{ width: '100%', overflow: maxHeight ? 'hidden' : 'initial' }}>
      <TableContainer component={Paper} sx={{ maxHeight: maxHeight }}>
        <Table
          size={isDense ? 'small' : undefined}
          stickyHeader={stickyHeader}
          sx={{ minWidth: 450 }}
          aria-label={`${title} table`}
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={`${title}-table-header-${column.id as string}`}
                  align="center"
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: T, rowIndex: number) => (
              <TableRow
                key={`${title}-row-${rowIndex}`}
                sx={{
                  '& td:last-child, & th:last-child': { borderRight: 0 },
                  '& td:first-child, & th:first-child': { borderLeft: 0 },
                }}
              >
                {columns.map((column) => {
                  const value = row[column.id] as React.ReactNode
                  return (
                    <StyledTableCell
                      key={column.id as string}
                      align={column.align}
                      component={column.isHeader ? 'th' : undefined}
                      scope={column.isHeader ? 'row' : undefined}
                      sx={{ fontWeight: column.isHeader ? 'bold' : 'initial' }}
                    >
                      {column.isLink ? (
                        <Link
                          href={value as string}
                          rel="noreferrer"
                          target="_blank"
                          underline="hover"
                        >
                          {value}
                        </Link>
                      ) : column.format && typeof value === 'number' ? (
                        column.format(value)
                      ) : (
                        value
                      )}
                    </StyledTableCell>
                  )
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

export default CustomTable
