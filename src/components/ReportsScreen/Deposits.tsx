import * as React from 'react'
import Table from '@mui/material/Table'
import { Button } from '@mui/material'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import CustomTablePagination from './CustomTablePagination'
function createData(
  vendorName: string,
  totalAmount: number,
  paidAmount: number,
  discount: number,
  remainingAmount: number
) {
  return { vendorName, totalAmount, paidAmount, discount, remainingAmount }
}

export default function Deposits() {
  const [rows, setRows] = React.useState<any[]>([
    createData('Ashwin', 3200, 2000, 50, 1150),
    createData('Siraj', 2000, 1000, 200, 800),
    createData('Raina', 1700, 1300, 50, 350),
    createData('Rahul', 2100, 700, 0, 1400),
    createData('Rohit', 4500, 2500, 100, 1900),
    createData('Kohli', 2700, 1100, 300, 1300),
    createData('Dhoni', 900, 200, 50, 650),
    createData('Yuvraj', 3800, 1200, 90, 2510),
  ])
  const [orderBy, setOrderBy] = React.useState<string>('')
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc')
  const [searchText, setSearchText] = React.useState<string>('')
  const [page, setPage] = React.useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5)
  const [jumpToPage, setJumpToPage] = React.useState<number>(1)

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrderBy(property)
    setOrder(isAsc ? 'desc' : 'asc')
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value)
    setPage(0)
  }

  const filteredRows = rows.filter((row) =>
    Object.values(row).some((value: any) =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  )

  const sortedRows = filteredRows.slice().sort((a, b) => {
    const isAsc = order === 'asc'
    if (orderBy === 'vendorName') {
      return isAsc
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy])
    } else {
      return isAsc ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy]
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
          style={{ marginTop: '2rem', float: 'right' }}
        />
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: '2rem',
                  paddingBottom: '3rem',
                  textAlign: 'center',
                }}
                colSpan={5}
              >
                Deposits
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'vendorName'}
                  direction={orderBy === 'vendorName' ? order : 'asc'}
                  onClick={() => handleSort('vendorName')}
                >
                  Vendor Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'totalAmount'}
                  direction={orderBy === 'totalAmount' ? order : 'asc'}
                  onClick={() => handleSort('totalAmount')}
                >
                  Total Amount(Rs.)
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'paidAmount'}
                  direction={orderBy === 'paidAmount' ? order : 'asc'}
                  onClick={() => handleSort('paidAmount')}
                >
                  Paid Amount(Rs.)
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderBy === 'discount'}
                  direction={orderBy === 'discount' ? order : 'asc'}
                  onClick={() => handleSort('discount')}
                >
                  Discount(Rs.)
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                Remaining Amount(Rs.)
                <TableSortLabel
                  active={orderBy === 'remainingAmount'}
                  direction={orderBy === 'remainingAmount' ? order : 'asc'}
                  onClick={() => handleSort('remainingAmount')}
                ></TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow
                  key={row.vendorName}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    height: '50px',
                  }}
                >
                  <TableCell component="th" scope="row">
                    {row.vendorName}
                  </TableCell>
                  <TableCell align="right">{row.totalAmount}</TableCell>
                  <TableCell align="right">{row.paidAmount}</TableCell>
                  <TableCell align="right">{row.discount}</TableCell>
                  <TableCell align="right">{row.remainingAmount}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {
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
        }
      </TableContainer>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          style={{
            cursor: 'pointer',
            width: 'auto',
            marginTop: '0.5rem',
            marginRight: '0.5rem',
          }}
        >
          Download Data
        </Button>
      </div>
    </>
  )
}
