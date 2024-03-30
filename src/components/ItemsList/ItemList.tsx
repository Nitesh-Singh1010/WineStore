import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CommonTable from '@components/common/CommonTable'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import TablePagination from '@mui/material/TablePagination'
import React, { useState, useMemo, useContext } from 'react'
import { AppLangContext } from '@Contexts'
interface ItemListData {
  id: number
  itemName: string
  costPrice: number
  sellingPrice: number
  quantity: number
}

type SortDirection = 'asc' | 'desc'

function sortComparator<T>(a: T, b: T, direction: SortDirection) {
  if (a < b) {
    return direction === 'asc' ? -1 : 1
  }
  if (a > b) {
    return direction === 'asc' ? 1 : -1
  }
  return 0
}

export default function ItemList() {
  const { appLang } = useContext(AppLangContext)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ItemListData
    direction: SortDirection
  } | null>(null)

  const [searchQuery, setSearchQuery] = useState<string>('')

  const requestSort = (key: keyof ItemListData) => {
    let direction: SortDirection = 'asc'
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  const [rows, setRows] = useState<ItemListData[]>([
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

  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [editedItem, setEditedItem] = useState<ItemListData | null>(null)

  const openEditModal = (item: ItemListData) => {
    setEditedItem(item)
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    setEditedItem(null)
    setEditModalOpen(false)
  }

  const deleteRow = (index: number) => {
    setRows((prevRows) => prevRows.filter((_, rowIndex) => rowIndex !== index))
  }

  const saveChanges = () => {
    if (editedItem && editedItem.sellingPrice >= editedItem.costPrice) {
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === editedItem.id ? { ...editedItem } : row
        )
      )
      closeEditModal()
    } else {
      // Handling validation error (selling price less than cost price)
      alert(appLang['feature.sellingPrice.costPrice.rule'])
    }
  }

  const columns = [
    {
      id: 'id',
      label: 'ID',
      component: (data: any) => <span>{data}</span>,
      requestSort: () => requestSort('id'),
    },
    {
      id: 'itemName',
      label: 'Item Name',
      component: (data: any) => <span>{data}</span>,
      requestSort: () => requestSort('itemName'),
    },
    {
      id: 'costPrice',
      label: 'Cost Price (Rs.)',
      component: (data: any) => <span>{data}</span>,
      requestSort: () => requestSort('costPrice'),
    },
    {
      id: 'sellingPrice',
      label: 'Selling Price (Rs.)',
      component: (data: any) => <span>{data}</span>,
      requestSort: () => requestSort('sellingPrice'),
    },
    {
      id: 'quantity',
      label: 'Quantity',
      component: (data: any) => <span>{data}</span>,
      requestSort: () => requestSort('quantity'),
    },
    {
      id: 'actions',
      label: 'Actions',
      component: (data: any, rowIndex: number) => (
        <div>
          <IconButton onClick={() => openEditModal(rows[rowIndex])}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => deleteRow(rowIndex)}>
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ]

  const sortedRows = useMemo(() => {
    if (!sortConfig) return rows
    return [...rows].sort((a, b) =>
      sortComparator(a[sortConfig.key], b[sortConfig.key], sortConfig.direction)
    )
  }, [rows, sortConfig])

  const filteredAndSortedRows = useMemo(() => {
    if (!searchQuery) return sortedRows
    const normalizedQuery = searchQuery.toLowerCase()
    return sortedRows.filter((row) =>
      row.itemName.toLowerCase().includes(normalizedQuery)
    )
  }, [sortedRows, searchQuery])

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  return (
    <div style={{ width: '100%' }}>
      <TextField
        fullWidth
        placeholder={appLang['feature.item.screens.tooltip&placeholders'][3]}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        margin="normal"
      />
      <CommonTable
        columns={columns}
        rows={filteredAndSortedRows
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((row) => [
            row.id,
            row.itemName,
            row.costPrice,
            row.sellingPrice,
            row.quantity,
            null,
          ])}
        title="Item List"
        sortConfig={sortConfig}
        requestSort={(key: keyof ItemListData) => {
          let direction: SortDirection = 'asc'
          if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'asc'
          ) {
            direction = 'desc'
          }
          setSortConfig({ key, direction })
        }}
      />
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAndSortedRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={editModalOpen} onClose={closeEditModal}>
        <DialogTitle>
          {appLang['feature.itemList.editItemModalHeading']}
        </DialogTitle>
        <DialogContent>
          {editedItem && (
            <>
              <TextField
                label={appLang['feature.item.screens.table.headers'][0]}
                value={editedItem.itemName}
                onChange={(e) =>
                  setEditedItem((prev) =>
                    prev ? { ...prev, itemName: e.target.value } : null
                  )
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label={appLang['feature.item.screens.table.headers'][1]}
                value={editedItem.costPrice}
                onChange={(e) =>
                  setEditedItem((prev) =>
                    prev ? { ...prev, costPrice: Number(e.target.value) } : null
                  )
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label={appLang['feature.item.screens.table.headers'][2]}
                value={editedItem.sellingPrice}
                onChange={(e) =>
                  setEditedItem((prev) =>
                    prev
                      ? { ...prev, sellingPrice: Number(e.target.value) }
                      : null
                  )
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label={appLang['feature.item.screens.table.headers'][3]}
                value={editedItem.quantity}
                onChange={(e) =>
                  setEditedItem((prev) =>
                    prev ? { ...prev, quantity: Number(e.target.value) } : null
                  )
                }
                fullWidth
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={saveChanges} color="primary">
            {appLang['feature.common.templates.popups.general.save.button']}
          </Button>
          <Button onClick={closeEditModal} color="primary">
            {appLang['feature.common.templates.popups.general.cancel.button']}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
