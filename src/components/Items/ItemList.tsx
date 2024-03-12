import * as React from 'react'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton/IconButton'
import Tooltip from '@mui/material/Tooltip'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FilterListIcon from '@mui/icons-material/FilterList'
import { visuallyHidden } from '@mui/utils'

interface Data {
  id: number
  itemName: string
  costPrice: number
  sellingPrice: number
  quantity: number
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = 'asc' | 'desc'

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

interface HeadCell {
  disablePadding: boolean
  id: keyof Data
  label: string
  numeric: boolean
}
const headCells: readonly {
  id: keyof Data
  numeric: boolean
  disablePadding: boolean
  label: string
}[] = [
  {
    id: 'itemName',
    numeric: false,
    disablePadding: false,
    label: 'Item Names',
  },
  {
    id: 'costPrice',
    numeric: true,
    disablePadding: false,
    label: 'Cost Price (Rs.)',
  },
  {
    id: 'sellingPrice',
    numeric: true,
    disablePadding: false,
    label: 'Selling Price (Rs.)',
  },
  { id: 'quantity', numeric: true, disablePadding: false, label: 'Quantity' },
]

interface EnhancedTableProps {
  numSelected: number
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}
function EnhancedTableHead(props: EnhancedTableProps) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props
  const createSortHandler =
    (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property)
    }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            style={
              index === headCells.length - 1 ? { paddingLeft: '72px' } : {}
            }
          >
            {headCell.id !== 'quantity' ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        ))}
        <TableCell align="right" style={{ paddingLeft: '72px' }}>
          Action
        </TableCell>
      </TableRow>
    </TableHead>
  )
}

interface EnhancedTableToolbarProps {
  numSelected: number
  onFilterChange: (filterValue: string) => void
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, onFilterChange } = props
  const [filterValue, setFilterValue] = React.useState<string>('')

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(event.target.value)
    onFilterChange(event.target.value)
  }

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <TextField
          sx={{ flex: '1 1 100%'}}
          label="Enter Item Name"
          variant="outlined"
          size="small"
          value={filterValue}
          onChange={handleFilterChange}
        />
      )}
      {numSelected > 0 ? (
        <></>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

export default function ItemList() {
  const [order, setOrder] = React.useState<Order>('asc')
  const [orderBy, setOrderBy] = React.useState<keyof Data>('sellingPrice')
  const [selected, setSelected] = React.useState<readonly number[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [rows, setRows] = React.useState<Data[]>([
    {
      id: 1,
      itemName: 'Item 1',
      costPrice: 280,
      sellingPrice: 360,
      quantity: 27,
    },
    {
      id: 2,
      itemName: 'Item 2',
      costPrice: 450,
      sellingPrice: 560,
      quantity: 31,
    },
    {
      id: 3,
      itemName: 'Item 3',
      costPrice: 170,
      sellingPrice: 210,
      quantity: 19,
    },
    {
      id: 4,
      itemName: 'Item 4',
      costPrice: 450,
      sellingPrice: 490,
      quantity: 47,
    },
    {
      id: 5,
      itemName: 'Item 5',
      costPrice: 220,
      sellingPrice: 255,
      quantity: 56,
    },
    {
      id: 6,
      itemName: 'Item 6',
      costPrice: 130,
      sellingPrice: 140,
      quantity: 10,
    },
    {
      id: 7,
      itemName: 'Item 7',
      costPrice: 790,
      sellingPrice: 850,
      quantity: 18,
    },
  ])

  const [open, setOpen] = React.useState(false)
  const [selectedRow, setSelectedRow] = React.useState<Data | null>(null)
  const [editedItem, setEditedItem] = React.useState<Data | null>(null)
  const [filteredRows, setFilteredRows] = React.useState<Data[]>(rows)

  React.useEffect(() => {
    setFilteredRows(rows)
  }, [rows])

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Data
  ) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly number[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    setSelected(newSelected)
  }

  const handleDeleteClick = () => {
    const updatedRows = rows.filter((row) => !selected.includes(row.id))
    setRows(updatedRows)
    setSelected([])
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const isSelected = (id: number) => selected.indexOf(id) !== -1

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - filteredRows.length) : 0

  const visibleRows = React.useMemo(
    () =>
      stableSort(filteredRows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, filteredRows]
  )

  const handleEditClick = (row: Data) => {
    setSelectedRow(row)
    setEditedItem({ ...row })
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedRow(null)
  }

  const handleSaveChanges = () => {
    if (!editedItem) return
    // validating selling price against cost price
    if (editedItem.sellingPrice < editedItem.costPrice) {
      alert('Selling price cannot be less than cost price.')
      return
    }
    const index = rows.findIndex((row) => row.id === selectedRow?.id)
    const updatedRows = [...rows]
    updatedRows[index] = editedItem
    setRows(updatedRows)
    setOpen(false)
    setSelectedRow(null)
  }

  const handleFilterChange = (filterValue: string) => {
    const filteredData = rows.filter(row =>
      row.itemName.toLowerCase().includes(filterValue.toLowerCase())
    )
    setFilteredRows(filteredData)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} onFilterChange={handleFilterChange} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={filteredRows.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.id)
                const labelId = `enhanced-table-checkbox-${index}`

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.id)}
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.id}
                    selected={isItemSelected}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="normal"
                    >
                      {row.itemName}
                    </TableCell>
                    <TableCell align="right">{row.costPrice}</TableCell>
                    <TableCell align="right">{row.sellingPrice}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEditClick(row)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton onClick={handleDeleteClick}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={open} onClose={handleClose}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Edit Item
          </Typography>
          {selectedRow && (
            <>
              <TextField
                label="Item Name"
                value={editedItem?.itemName || ''}
                onChange={(e) =>
                  setEditedItem((prev) => {
                    if (!prev) return null
                    return {
                      ...prev,
                      itemName: e.target.value,
                    }
                  })
                }
                fullWidth
                margin="normal"
                variant="outlined"
              />

              <TextField
                label="Cost Price (Rs.)"
                value={editedItem?.costPrice || ''}
                onChange={(e) =>
                  setEditedItem((prev) => {
                    if (!prev) return null
                    return {
                      ...prev,
                      costPrice: e.target.value,
                    }
                  })
                }
                fullWidth
                margin="normal"
                variant="outlined"
                type="number"
              />

              <TextField
                label="Selling Price (Rs.)"
                value={editedItem?.sellingPrice || ''}
                //
                onChange={(e) =>
                  setEditedItem((prev) => {
                    if (!prev) return null
                    return {
                      ...prev,
                      sellingPrice: e.target.value,
                    }
                  })
                }
                fullWidth
                margin="normal"
                variant="outlined"
                type="number"
              />

              <TextField
                label="Quantity"
                value={editedItem?.quantity || ''}
                onChange={(e) =>
                  setEditedItem((prev) => {
                    if (!prev) return null
                    return {
                      ...prev,
                      quantity: e.target.value,
                    }
                  })
                }
                fullWidth
                margin="normal"
                variant="outlined"
                type="number"
              />
            </>
          )}
          <Box sx={{ mt: 2, textAlign: 'right' }}>
            <Button onClick={handleSaveChanges} color="primary">
              Save Changes
            </Button>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}

