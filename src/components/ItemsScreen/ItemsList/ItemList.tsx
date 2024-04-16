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
import React, { useState, useMemo, useContext, useEffect } from 'react'
import { AppLangContext } from '@Contexts'
interface ItemListData {
  id: number
  itemName: string
  costPrice: number
  sellingPrice: number
  quantity: { size: string; value: number; identifier: number }
  quantityType: number
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
  const [rows, setRows] = useState<ItemListData[]>([])
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [lastEditedItem, setlastEditedItem] = useState<ItemListData | null>(
    null
  )
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [page, setPage] = useState(0)
  const [showAlert, setShowAlert] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const { appLang } = useContext(AppLangContext)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ItemListData
    direction: SortDirection
  } | null>(null)
  useEffect(() => {
    getAllItems()
  }, [])

  const updateItem = async () => {
    try {
      if (!lastEditedItem) return
      if (lastEditedItem.sellingPrice < lastEditedItem.costPrice) {
        alert('Selling price cannot be less than cost price')
        return
      }
      const data = {
        name: lastEditedItem.itemName,
        cost_price: lastEditedItem.costPrice,
        sale_price: lastEditedItem.sellingPrice,
        quantity_type_id: lastEditedItem.quantityType,
      }

      const response = await fetch(
        `http://localhost:8000/api/item/update/${lastEditedItem.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            store: '1',
          },
          body: JSON.stringify(data),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()

      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === lastEditedItem.id ? { ...row, ...lastEditedItem } : row
        )
      )
      alert('Item Updated Succesfully')
      setEditModalOpen(false)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  const getAllItems = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/items', {
        method: 'GET',
        headers: {
          'User-Agent': 'insomnia/8.6.1',
          store: '1',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json()

      const apiRows = responseData.data.map((item: any) => ({
        id: item.id,
        itemName: item.identifier,
        costPrice: parseFloat(item.cost_price),
        sellingPrice: parseFloat(item.sale_price),
        quantity: {
          size: item.quantity.size,
          value: parseInt(item.quantity.value),
          identifier: item.quantity.identifier,
        },
        quantityType: item.quantity_type,
      }))

      setRows(apiRows)
    } catch (error) {
      console.error('Error:', error)
    }
  }

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

  const openEditModal = async (item: ItemListData) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/item/get/${item.id}`,
        {
          method: 'GET',
          headers: {
            store: '1',
          },
        }
      )
      if (response.ok) {
        const data = await response.json()
        const editedItemData: ItemListData = {
          id: data.data.id,
          itemName: data.data.name,
          costPrice: parseFloat(data.data.cost_price),
          sellingPrice: parseFloat(data.data.sale_price),
          quantity: {
            size: data.data.quantity.size,
            value: parseFloat(data.data.quantity.value),
            identifier: data.data.quantity.identifier,
          },
          quantityType: data.data.quantity_type,
        }
        setlastEditedItem(editedItemData)
        setEditModalOpen(true)
      } else {
        console.error('Failed to fetch item details:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching item details:', error)
    }
  }

  const closeEditModal = () => {
    setlastEditedItem(null)
    setEditModalOpen(false)
  }

  const deleteRow = async (index: number) => {
    const itemIdToDelete = rows[index].id
    try {
      await updateItemStatus(itemIdToDelete, 'Deleted')

      setRows((prevRows) =>
        prevRows.filter((_, rowIndex) => rowIndex !== index)
      )
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const columns = [
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
      component: (data: any) => <span>{data.identifier}</span>,
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
          {lastEditedItem && (
            <>
              <TextField
                label={appLang['feature.item.screens.table.headers'][0]}
                value={lastEditedItem.itemName}
                onChange={(e) =>
                  setlastEditedItem((prev) =>
                    prev ? { ...prev, itemName: e.target.value } : null
                  )
                }
                fullWidth
                margin="normal"
                disabled
              />
              <TextField
                label={appLang['feature.item.screens.table.headers'][1]}
                value={lastEditedItem.costPrice}
                onChange={(e) =>
                  setlastEditedItem((prev) =>
                    prev ? { ...prev, costPrice: Number(e.target.value) } : null
                  )
                }
                fullWidth
                margin="normal"
              />

              <TextField
                label={appLang['feature.item.screens.table.headers'][2]}
                value={lastEditedItem.sellingPrice}
                onChange={(e) =>
                  setlastEditedItem((prev) =>
                    prev
                      ? { ...prev, sellingPrice: Number(e.target.value) }
                      : null
                  )
                }
                fullWidth
                margin="normal"
                onBlur={(e) => {
                  if (Number(e.target.value) < lastEditedItem.costPrice) {
                    setShowAlert(true)
                  } else {
                    setShowAlert(false)
                  }
                }}
                onFocus={() => {
                  setShowAlert(false)
                }}
              />
              {showAlert && (
                <div style={{ color: 'red' }}>
                  Selling price cannot be less than cost price
                </div>
              )}

              {/* <TextField
                label={appLang['feature.item.screens.table.headers'][2]}
                value={lastEditedItem.sellingPrice}
                onChange={(e) =>
                  setlastEditedItem((prev) =>
                    prev
                      ? { ...prev, sellingPrice: Number(e.target.value) }
                      : null
                  )
                }
                fullWidth
                margin="normal"
              /> */}
              <TextField
                label={appLang['feature.item.screens.table.headers'][3]}
                value={`${lastEditedItem.quantity.value}-${lastEditedItem.quantity.size}`}
                fullWidth
                margin="normal"
                disabled
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={updateItem} color="primary">
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
