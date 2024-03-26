import React, { useState, useContext } from 'react'
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
import { AppLangContext } from '@Contexts'
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
  const { appLang } = useContext(AppLangContext)

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
      alert(appLang['feature.manualAdditionPage.alerts'][0])
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
      alert(appLang['feature.manualAdditionPage.alerts'][1])
    }
  }

  const handleAddInventory = () => {
    const lastItem = items[items.length - 1]
    if (!isItemDefault(lastItem) && isValidPrice(lastItem)) {
      console.log(items)
    } else {
      alert(appLang['feature.manualAdditionPage.alerts'][2])
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
      setError(
        appLang['feature.manualAdditionPage.quantityRestrictionMessages'][0]
      )
      return
    } else if (
      (newUnit === 'g' || newUnit === 'ml') &&
      parseInt(newQuantity) > 10000
    ) {
      setError(
        appLang['feature.manualAdditionPage.quantityRestrictionMessages'][1]
      )
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
            <TableCell>
              {appLang['feature.item.screens.table.headers'][0]}
            </TableCell>
            <TableCell>
              {appLang['feature.item.screens.table.headers'][1]}
            </TableCell>
            <TableCell>
              {appLang['feature.item.screens.table.headers'][2]}
            </TableCell>
            <TableCell className="quantity-column">
              {appLang['feature.item.screens.table.headers'][3]}
              <Tooltip title="Edit">
                <IconButton onClick={handleOpenModal}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            </TableCell>
            <TableCell>
              {appLang['feature.item.screens.table.headers'][5]}
            </TableCell>
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
        {appLang['feature.common.templates.addItem.button']}
      </Button>
      <div className="add-item-button-container">
        <Button
          onClick={handleAddInventory}
          variant="contained"
          color="primary"
          className="add-inventory-button"
        >
          {appLang['feature.common.templates.addItem.button']}
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
