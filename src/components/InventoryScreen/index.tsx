import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import TablePagination from '@mui/material/TablePagination';

function createData(
  itemName: string,
  costPrice: number,
  sellingPrice: number,
  type: string,
  status: 'Active' | 'Inactive'
) {
  return { itemName, costPrice, sellingPrice, type, status };
}

export default function Inventory() {
  const [rows, setRows] = React.useState<any[]>([
    createData('Red Label', 320, 390, 'Whiskey', 'Active'),
    createData('Old Monk', 150, 180, 'Rum', 'Active'),
    createData('Double Black Label', 279, 300, 'Whiskey', 'Inactive'),
    createData('Sula', 540, 560, 'Wine', 'Inactive'),
    createData('Magic Moments', 900, 950, 'Vodka', 'Active'),
    createData('Blenders Pride', 700, 950, 'Whiskey', 'Active'),
    createData('Absolute Vodka', 900, 1100, 'Vodka', 'Active'),
    createData('Bacardi Black', 660, 750, 'Black Rum', 'Inactive'),
  ]);
  const [orderBy, setOrderBy] = React.useState<string>('');
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [searchText, setSearchText] = React.useState<string>('');
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);

  const handleSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrderBy(property);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setPage(0); // Reset page when search text changes
  };

  const filteredRows = rows.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
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
              sx={{ fontSize: '2rem', paddingBottom:'3rem', textAlign: 'center' }}
              colSpan={5}
            >
              Inventory
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
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === 'costPrice'}
                direction={orderBy === 'costPrice' ? order : 'asc'}
                onClick={() => handleSort('costPrice')}
              >
                Cost Price (Rs.)
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === 'sellingPrice'}
                direction={orderBy === 'sellingPrice' ? order : 'asc'}
                onClick={() => handleSort('sellingPrice')}
              >
                Selling Price (Rs.)
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === 'type'}
                direction={orderBy === 'type' ? order : 'asc'}
                onClick={() => handleSort('type')}
              >
                Type
              </TableSortLabel>
            </TableCell>
            <TableCell align="right">
              <TableSortLabel
                active={orderBy === 'status'}
                direction={orderBy === 'status' ? order : 'asc'}
                onClick={() => handleSort('status')}
              >
                Status
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredRows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .sort((a, b) => {
              const isAsc = order === 'asc';
              if (
                orderBy === 'itemName' ||
                orderBy === 'type' ||
                orderBy === 'status'
              ) {
                return isAsc
                  ? a[orderBy].localeCompare(b[orderBy])
                  : b[orderBy].localeCompare(a[orderBy]);
              }
              return isAsc
                ? a[orderBy] - b[orderBy]
                : b[orderBy] - a[orderBy];
            })
            .map(row => (
              <TableRow
                key={row.itemName}
                sx={{
                  '&:last-child td, &:last-child th': { border: 0 },
                  height: '50px',
                }}
              >
                <TableCell component="th" scope="row">
                  {row.itemName}
                </TableCell>
                <TableCell align="right">{row.costPrice}</TableCell>
                <TableCell align="right">{row.sellingPrice}</TableCell>
                <TableCell align="right">{row.type}</TableCell>
                <TableCell align="right">{row.status}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
}

