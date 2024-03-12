import React, { useState } from 'react'
import {
  Button,
  TextField,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
  Typography,
  Select,
  MenuItem,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import Autocomplete from '@mui/material/Autocomplete'

interface Item {
  itemName: string
  costPrice: number
  sellingPrice: number
  quantity: string | null
}

const ManualAdditionComponent: React.FC = () => {
  const [quantityOptions, setQuantityOptions] = useState<string[]>([
    '50ml(Miniature)',
    '180ml(Quarter)',
    '330ml(Beer Pint)',
    '375ml(Half)',
    '500ml(Beer Can)',
    '650ml(Beer)',
    '750ml(Full)',
    '1L',
    '1.5L',
  ])

  const [items, setItems] = useState<Item[]>([
    {
      itemName: '',
      costPrice: 0,
      sellingPrice: 0,
      quantity: null,
    },
  ])

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [newQuantity, setNewQuantity] = useState<string>('')
  const [newUnit, setNewUnit] = useState<string>('')

  const isItemDefault = (item: Item) => {
    return (
      !item.itemName ||
      item.costPrice <= 0 ||
      item.sellingPrice <= 0 ||
      !item.quantity
    )
  }

  const handleDeleteItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items]
      newItems.splice(index, 1)
      setItems(newItems)
    } else {
      alert('You cannot delete the only row.')
    }
  }

  const handleItemChange = (index: number, field: keyof Item, value: any) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const handleAddItem = () => {
    const lastItem = items[items.length - 1]
    if (!isItemDefault(lastItem) && isValidPrice(lastItem)) {
      const newItem = {
        itemName: '',
        costPrice: 0,
        sellingPrice: 0,
        quantity: null,
      }
      setItems([...items, newItem])
    } else {
      alert(
        'Please complete the previous item correctly before adding a new one. Ensure the selling price is not less than the cost price.'
      )
    }
  }

  const handleAddInventory = () => {
    const lastItem = items[items.length - 1]
    if (!isItemDefault(lastItem) && isValidPrice(lastItem)) {
      console.log(items)
    } else {
      alert(
        'Please complete the last item correctly before submitting. Ensure the selling price is not less than the cost price.'
      )
    }
  }

  const isValidPrice = (item: Item) => {
    return item.sellingPrice >= item.costPrice
  }

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setNewQuantity('')
    setNewUnit('')
  }

  const handleModalSubmit = () => {
    if (newQuantity && newUnit) {
      setQuantityOptions([...quantityOptions, `${newQuantity} ${newUnit}`])
      handleCloseModal()
    }
  }

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Item Name</TableCell>
            <TableCell>Cost Price</TableCell>
            <TableCell>Selling Price</TableCell>
            <TableCell
              style={{ display: 'flex', justifyContent: 'space-between' }}
            >
              Quantity
              <Tooltip title="Edit">
                <IconButton onClick={handleOpenModal}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell style={{ width: '50%' }}>
                <TextField
                  value={item.itemName}
                  onChange={(e) =>
                    handleItemChange(index, 'itemName', e.target.value)
                  }
                  fullWidth
                  placeholder="Item Name"
                />
              </TableCell>
              <TableCell style={{ width: '15%' }}>
                <TextField
                  type="number"
                  value={item.costPrice}
                  onChange={(e) =>
                    handleItemChange(index, 'costPrice', Number(e.target.value))
                  }
                  fullWidth
                />
              </TableCell>
              <TableCell style={{ width: '15%' }}>
                <TextField
                  type="number"
                  value={item.sellingPrice}
                  onChange={(e) =>
                    handleItemChange(
                      index,
                      'sellingPrice',
                      Number(e.target.value)
                    )
                  }
                  fullWidth
                />
              </TableCell>
              <TableCell style={{ width: '20%' }}>
                <Autocomplete
                  value={item.quantity}
                  onChange={(event, value) =>
                    handleItemChange(index, 'quantity', value)
                  }
                  options={quantityOptions}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Quantity"
                      fullWidth
                      placeholder="Select or enter quantity"
                    />
                  )}
                />
              </TableCell>
              <TableCell>
                {items.length > 1 && (
                  <Tooltip title="Delete">
                    <IconButton
                      onClick={() => handleDeleteItem(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={handleAddItem}
        variant="contained"
        color="primary"
        style={{ marginTop: '10px' }}
      >
        Add Item
      </Button>
      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          onClick={handleAddInventory}
          variant="contained"
          color="primary"
        >
          Add Item(s)
        </Button>
      </div>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'white',
            padding: '20px',
            outline: 'none',
          }}
        >
          <Typography variant="h6" gutterBottom>
            Add Quantity
          </Typography>
          <TextField
            label="Enter Quantity"
            placeholder="Enter Quantity"
            fullWidth
            value={newQuantity}
            onChange={(e) => {
              const value = e.target.value
              if (value === '' || Number(value) > 0) {
                setNewQuantity(value)
              }
            }}
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            required
          />

          <Select
            value={newUnit}
            onChange={(e) => setNewUnit(e.target.value as string)}
            displayEmpty
            fullWidth
            required
            style={{ marginTop: '10px' }}
          >
            <MenuItem value="" disabled>
              Select Unit
            </MenuItem>
            <MenuItem value="L">L</MenuItem>
            <MenuItem value="ml">ml</MenuItem>
            <MenuItem value="Kg">Kg</MenuItem>
            <MenuItem value="g">g</MenuItem>
          </Select>
          <Button
            onClick={handleModalSubmit}
            variant="contained"
            color="primary"
            style={{ marginTop: '10px' }}
          >
            Save Quantity
          </Button>
        </div>
      </Modal>
    </>
  )
}

export default ManualAdditionComponent
