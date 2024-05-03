import React from 'react';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { rowsPerPageOptions } from '../../../vars.json'; 
import lang from '../../../lang-en.json'
import './CustomTablePagination'

interface CustomTablePaginationProps {
  count: number;
  rowsPerPage: number;
  page: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
  onRowsPerPageChange: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  >;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
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
      rowsPerPageOptions={rowsPerPageOptions}
      component="div"
      count={count}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
      labelRowsPerPage="Rows per page:"
      labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
      ActionsComponent={({ page, count, rowsPerPage }) => (
        <div className="pagination-actions">
          <TextField
            variant="outlined"
            size="small"
            type="number"
            value={jumpToPage}
            onChange={(e) => setJumpToPage(parseInt(e.target.value, 10))}
            inputProps={{
              min: 1,
              max: Math.ceil(count / rowsPerPage),
              className: 'pagination-input',
            }}
            className="pagination-textfield"
          />
          <Button
            variant="outlined"
            onClick={handleJumpToPage}
            className="pagination-button-go"
          >
            {lang["feature.go.button"]}
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleChangePage(event, page - 1)}
            disabled={page === 0}
            className="pagination-button-prev"
          >
            {'<'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => handleChangePage(event, page + 1)}
            disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            className="pagination-button-next"
          >
            {'>'}
          </Button>
        </div>
      )}
    />
  );
};

export default CustomTablePagination;



