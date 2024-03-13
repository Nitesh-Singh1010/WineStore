import * as React from 'react';
import Table from '@mui/material/Table';
import { Button } from '@mui/material';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import TablePagination from '@mui/material/TablePagination';
import Chip from '@mui/material/Chip';
import { WidthFull } from '@mui/icons-material';

function createData(
  itemName: string,
  costPrice: number,
  sellingPrice: number,
  quantityValue: number,
  quantityUnit: string,
  status: 'Active' | 'Inactive'
) {
  return { itemName, costPrice, sellingPrice, quantity: `${quantityValue}${quantityUnit}`, status };
}

export default function Inventory() {
  const [rows, setRows] = React.useState<any[]>([
    createData('Red Label', 320, 390, 750, 'ml', 'Active'),
    createData('Old Monk', 150, 180, 750, 'ml', 'Active'),
    createData('Double Black Label', 279, 300, 180, 'ml', 'Inactive'),
    createData('Sula', 540, 560, 500, 'ml', 'Inactive'),
    createData('Magic Moments', 900, 950, 750, 'ml', 'Active'),
    createData('Blenders Pride', 700, 950, 360, 'ml', 'Active'),
    createData('Absolute Vodka', 900, 1100, 1, 'L', 'Active'),
    createData('Bacardi Black', 660, 750, 1, 'L', 'Inactive'),
  ]);
  const [orderBy, setOrderBy] = React.useState<string>('');
  const [order, setOrder] = React.useState<'asc' | 'desc'>('asc');
  const [searchText, setSearchText] = React.useState<string>('');
  const [page, setPage] = React.useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(5);
  const [jumpToPage, setJumpToPage] = React.useState<number>(0);

  const handleSort = (property: string) => {
    if (property !== 'quantity') {
      const isAsc = orderBy === property && order === 'asc';
      setOrderBy(property);
      setOrder(isAsc ? 'desc' : 'asc');
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setPage(0); 
  };

  const filteredRows = rows.filter(row =>
    Object.values(row).some(value =>
      value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const sortedRows = filteredRows.slice().sort((a, b) => {
    const isAsc = order === 'asc';
    if (orderBy === 'itemName' || orderBy === 'status') {
      return isAsc
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    } else {
      return isAsc ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy];
    }
  });

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleJumpToPage = () => {
    if (jumpToPage >= 1 && jumpToPage <= Math.ceil(filteredRows.length / rowsPerPage)) {
      setPage(jumpToPage - 1);
    } else {
      alert('Invalid Page number.')
      console.error('Invalid page number');
    }
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
            <TableCell align="right">Quantity</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">
                  <Chip
                    label={row.status}
                    color={row.status === 'Active' ? 'primary' : 'secondary'}
                  />
                </TableCell>
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
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        ActionsComponent={() => (
          <div style={{display: 'flex'}}>
            <TextField
              variant="outlined"
              size="small"
              type="number"
              value={jumpToPage}
              onChange={(e) => setJumpToPage(parseInt(e.target.value))}
              inputProps={{ min: 1, max: Math.ceil(filteredRows.length / rowsPerPage) }}
              style={{ marginRight: '1rem',marginLeft:'1rem', width: '5rem' }}
            />
            <Button
              variant="outlined"
              onClick={handleJumpToPage}
              style={{ cursor: 'pointer', width: 'auto' }}
            >
              Go
            </Button>
          </div>
        )}
      />
    </TableContainer>
  );
}



