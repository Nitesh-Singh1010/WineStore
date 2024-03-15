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
import TablePagination from '@mui/material/TablePagination'
import CustomTablePagination from './CustomTablePagination'

function createData(
  itemName: string,
  Quantity: number,
  totalAmount: number,
  costPrice: number,
  discount: number,
  sellingPrice: number,
  transactionDate: Date,
  paymentMode: 'UPI' | 'Cash' | 'Card'
) {
  return {
    itemName,
    Quantity,
    totalAmount,
    costPrice,
    discount,
    sellingPrice,
    transactionDate,
    paymentMode,
  }
}

export default function Transactions() {
  const [rows, setRows] = React.useState<any[]>([
    createData(
      'Red Label',
      12,
      3200,
      2000,
      50,
      1150,
      new Date('2024-03-13'),
      'Cash'
    ),
    createData(
      'Absolute Vodka',
      10,
      2000,
      1000,
      200,
      800,
      new Date('2024-03-12'),
      'Card'
    ),
    createData(
      'Bombay Sapphire',
      19,
      1700,
      1300,
      50,
      350,
      new Date('2024-03-11'),
      'UPI'
    ),
    createData(
      'Old Monk Gold Reserve 12 Yrs',
      7,
      2100,
      700,
      0,
      1400,
      new Date('2024-03-10'),
      'UPI'
    ),
    createData('Sula', 6, 4500, 2500, 100, 1900, new Date('2024-03-1'), 'Cash'),
    createData(
      'Tuborg Classic',
      2,
      2700,
      1100,
      300,
      1300,
      new Date('2024-02-25'),
      'Cash'
    ),
    createData(
      'Ballentine',
      2,
      900,
      200,
      50,
      650,
      new Date('2024-02-28'),
      'Card'
    ),
    createData(
      'Black Bacardi',
      8,
      3800,
      1200,
      90,
      2510,
      new Date('2024-02-24'),
      'Card'
    ),
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

  const filteredRows = rows.filter((row) => {
    const searchTextLower = searchText.toLowerCase()
    return (
      Object.values(row).some((value: any) =>
        value.toString().toLowerCase().includes(searchTextLower)
      ) || row.transactionDate.toLocaleDateString().includes(searchTextLower) // This line should be replaced
    )
  })

  const sortedRows = filteredRows.slice().sort((a, b) => {
    const isAsc = order === 'asc'
    if (
      orderBy === 'itemName' ||
      orderBy === 'paymentMode'
    ) {
      return isAsc
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy])
    } else if (orderBy === 'transactionDate') {
      return isAsc
        ? a.transactionDate.getTime() - b.transactionDate.getTime()
        : b.transactionDate.getTime() - a.transactionDate.getTime()
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
      <TableContainer component={Paper} style={{ overflowX: 'auto' }}>
        <TextField
          variant="standard"
          placeholder="Search to Filter Rows"
          value={searchText}
          onChange={handleSearch}
          style={{ marginTop: '2rem', float: 'right' }}
        />
        <Table sx={{ minWidth: 650 }} size="small">
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  fontSize: '2rem',
                  paddingBottom: '3rem',
                  textAlign: 'center',
                }}
                colSpan={8}
              >
                Transactions
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'itemName'}
                  direction={orderBy === 'itemName' ? order : 'asc'}
                  onClick={() => handleSort('itemName')}
                >
                  Item Name
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'Quantity'}
                  direction={orderBy === 'Quantity' ? order : 'asc'}
                  onClick={() => handleSort('Quantity')}
                >
                  Quantity
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'totalAmount'}
                  direction={orderBy === 'totalAmount' ? order : 'asc'}
                  onClick={() => handleSort('totalAmount')}
                >
                  Total Amount(Rs.)
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'costPrice'}
                  direction={orderBy === 'costPrice' ? order : 'asc'}
                  onClick={() => handleSort('costPrice')}
                >
                  Cost Price(Rs.)
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                <TableSortLabel
                  active={orderBy === 'discount'}
                  direction={orderBy === 'discount' ? order : 'asc'}
                  onClick={() => handleSort('discount')}
                >
                  Discount(Rs.)
                </TableSortLabel>
              </TableCell>
              <TableCell align="center">
                Selling Price(Rs.)
                <TableSortLabel
                  active={orderBy === 'sellingPrice'}
                  direction={orderBy === 'sellingPrice' ? order : 'asc'}
                  onClick={() => handleSort('sellingPrice')}
                ></TableSortLabel>
              </TableCell>
              <TableCell align="center">
                Date
                <TableSortLabel
                  active={orderBy === 'transactionDate'}
                  direction={orderBy === 'transactionDate' ? order : 'asc'}
                  onClick={() => handleSort('transactionDate')}
                ></TableSortLabel>
              </TableCell>
              <TableCell align="center">
                Payment Mode
                <TableSortLabel
                  active={orderBy === 'paymentMode'}
                  direction={orderBy === 'paymentMode' ? order : 'asc'}
                  onClick={() => handleSort('paymentMode')}
                ></TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow
                  key={row.itemName}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    height: '50px',
                  }}
                >
                  <TableCell
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                  >
                    {row.itemName}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                  >
                    {row.Quantity}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                  >
                    {row.totalAmount}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                  >
                    {row.costPrice}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                  >
                    {row.discount}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                  >
                    {row.sellingPrice}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                  >
                    {row.transactionDate.toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    align="center"
                    style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}
                  >
                    {row.paymentMode}
                  </TableCell>
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
