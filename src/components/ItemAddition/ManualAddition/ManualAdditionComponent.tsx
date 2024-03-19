import React, { useState } from 'react'
import {
  Button,
  Table,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  IconButton,
  Tooltip,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import ItemRow from './ItemRow'
import QuantityModal from './QuantityModal'
import './ManualAdditionComponent.scss'

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
  const [error, setError] = React.useState<string | null>(null)

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
    if ((newUnit === 'L' || newUnit === 'Kg') && parseInt(newQuantity) > 3) {
      setError('Quantity should be 2 or less for units L or Kg')
      return
    } else if (
      (newUnit === 'g' || newUnit === 'ml') &&
      parseInt(newQuantity) > 10000
    ) {
      setError('Quantity should be 1000 or less for units g or ml')
      return
    }
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
            <TableCell className="quantity-column">
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
            <ItemRow
              key={index}
              item={item}
              index={index}
              quantityOptions={quantityOptions}
              handleItemChange={handleItemChange}
              handleDeleteItem={handleDeleteItem}
            />
          ))}
        </TableBody>
      </Table>
      <Button
        onClick={handleAddItem}
        variant="contained"
        color="primary"
        className="add-item-button"
      >
        Add Item
      </Button>
      <div className="add-item-button-container">
        <Button
          onClick={handleAddInventory}
          variant="contained"
          color="primary"
          className="add-inventory-button"
        >
          Add Item(s)
        </Button>{' '}
      </div>
      <QuantityModal
        open={modalOpen}
        handleClose={handleCloseModal}
        newQuantity={newQuantity}
        setNewQuantity={setNewQuantity}
        newUnit={newUnit}
        setNewUnit={setNewUnit}
        error={error}
        handleModalSubmit={handleModalSubmit}
      />
    </>
  )
}

export default ManualAdditionComponent
