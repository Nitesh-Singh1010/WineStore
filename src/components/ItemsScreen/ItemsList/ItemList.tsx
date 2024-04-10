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
  quantity: { size: string; value: number }
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
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const { appLang } = useContext(AppLangContext)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof ItemListData
    direction: SortDirection
  } | null>(null)
  useEffect(() => {
    getAllItems()
    // itemsSend()
  }, [])
  const itemsSend = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/item/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          store: '1',
        },
        body: JSON.stringify({
          name: 'BP',
          cost_price: 400,
          sale_price: 900,
          quantity: {
            size: 'FULL',
            value: 4,
          },
        }),
      })
      if (!response.ok) {
        throw new Error(
          `HTTP error! status in POST request: ${response.status}`
        )
      }
      const data = await response.json()
      console.log('Success:', data)
    } catch (error) {
      console.error('Error in POST request:', error)
    }
  }

  const itemsFetch = async (itemId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/item/get/${itemId}`,
        {
          method: 'GET',
          headers: {
            store: '1',
          },
        }
      )
      if (!response.ok) {
        throw new Error('Network response was not ok in Get request')
      }
      const data = await response.json()
      if (data.status === 'OK') {
        console.log('Success', data)
      } else {
        console.error('API Response Error:', data.message)
      }
    } catch (error) {
      console.error(
        'There was a problem with  fetch operation in this GET request:',
        error
      )
    }
  }

  const updateItemStatus = async (itemId: number, newStatus: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/item/status_update/${itemId}?status=${newStatus}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            store: '1',
            'User-Agent': 'insomnia/8.6.1',
          },
        }
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      console.log('Success:', data)
    } catch (error) {
      console.error('Error:', error)
    }
  }
  const updateItem = async (itemId) => {
    try {
      const data = {
        name: 'Black Label',
        cost_price: 300,
        sale_price: 1000,
        quantity: {
          size: 'FULL',
          value: 1,
        },
      }

      const response = await fetch(
        `http://localhost:8000/api/item/update/${itemId}`,
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
      console.log('Success:', responseData)
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
        itemName: item.name,
        costPrice: parseFloat(item.cost_price),
        sellingPrice: parseFloat(item.sale_price),
        quantity: {
          size: item.quantity.size,
          value: parseInt(item.quantity.value),
          identifier: item.quantity.identifier,
        },
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
          },
        }
        setlastEditedItem(editedItemData) // Set fetched item details
        setEditModalOpen(true) // Open the edit modal
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
    // setRows((prevRows) => prevRows.filter((_, rowIndex) => rowIndex !== index))
    const itemIdToDelete = rows[index].id
    try {
      // Call the updateItemStatus API with the ID of the row being deleted
      await updateItemStatus(itemIdToDelete, 'Deleted')

      // Remove the deleted row from the rows state
      setRows((prevRows) =>
        prevRows.filter((_, rowIndex) => rowIndex !== index)
      )
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const saveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/item/update/${lastEditedItem.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            store: '1',
          },
          body: JSON.stringify(lastEditedItem), // Assuming lastEditedItem contains updated values
        }
      )
      if (response.ok) {
        // Update the UI or any state if needed
        setEditModalOpen(false) // Close the edit modal
      } else {
        console.error('Failed to update item:', response.statusText)
      }
    } catch (error) {
      console.error('Error updating item:', error)
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
              />
              {/* <TextField
                label={appLang['feature.item.screens.table.headers'][3]}
                value={lastEditedItem.quantity.value}
                onChange={(e) =>
                  setlastEditedItem((prev) =>
                    prev
                      ? {
                          ...prev,
                          quantity: {
                            ...prev.quantity,
                            value: Number(e.target.value),
                          },
                        }
                      : null
                  )
                }
                fullWidth
                margin="normal"
                disabled
              /> */}
              <TextField
                label={appLang['feature.item.screens.table.headers'][3]}
                value={`${lastEditedItem.quantity.value}-${lastEditedItem.quantity.size}`}
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
