import React from 'react';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
interface CustomTablePaginationProps {
    count: number;
    rowsPerPage: number;
    page: number;
    onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    onRowsPerPageChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>;
    handleChangePage: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
    jumpToPage: number;
    setJumpToPage: React.Dispatch<React.SetStateAction<number>>;
    handleJumpToPage: () => void;
  }
  const CustomTablePagination: React.FC<CustomTablePaginationProps> = ({
    count,
    rowsPerPage,
    page,
    onPageChange,
    onRowsPerPageChange,
    handleChangePage,
    jumpToPage,
    setJumpToPage,
    handleJumpToPage,
  }) => {
    return (
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={count}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        labelRowsPerPage="Rows per page:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        ActionsComponent={({ page, count, rowsPerPage }) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: '1rem',
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              type="number"
              value={jumpToPage}
              onChange={(e) => setJumpToPage(parseInt(e.target.value, 10))}
              inputProps={{
                min: 1,
                max: Math.ceil(count / rowsPerPage),
                style: { textAlign: 'center' },
              }}
              style={{
                width: '5rem',
              }}
            />
            <Button
              variant="outlined"
              onClick={handleJumpToPage}
              style={{ cursor: 'pointer', margin: '0 1rem' }}
            >
              Go
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleChangePage(event, page - 1)}
              disabled={page === 0}
              style={{ cursor: 'pointer', marginRight: '1rem' }}
            >
              {'<'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleChangePage(event, page + 1)}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              style={{ cursor: 'pointer' }}
            >
              {'>'}
            </Button>
          </div>
        )}
      />
    );
  };
  export default CustomTablePagination;
