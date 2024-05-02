import React, { useState, useContext, useEffect } from 'react'
import {
  Button,
  TextField,
  IconButton,
  Tooltip,
  Autocomplete,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import QuantityModal from './QuantityModal'
import './ManualAdditionComponent.scss'
import { AppLangContext } from '@Contexts'
import CommonTable from '@components/common/CommonTable'

interface Item {
  itemName: string
  costPrice: number
  sellingPrice: number
  quantity: string | null
  quantityTypeId: number
}

const ManualAdditionComponent: React.FC = () => {
  const [quantityOptions, setQuantityOptions] = useState<string[]>([])
  const [responseData, setResponseData] = useState<any>(null)
  const defaultItem = {
    itemName: '',
    costPrice: 0,
    sellingPrice: 0,
    quantity: null,
    quantityTypeId: 0, // Initialize quantityTypeId
  }
  const [items, setItems] = useState<Item[]>([defaultItem])
  const [quantityModalOpen, setQuantityModalOpen] = useState<boolean>(false)
  const [quantityCreatedState, setQuantityCreatedState] =
    useState<boolean>(false)
  const [newQuantity, setNewQuantity] = useState<string>('')
  const [newUnit, setNewUnit] = useState<string>('')
  const [invalidQuantityError, setInvalidQuantityError] = React.useState<
    string | null
  >(null)
  const { appLang } = useContext(AppLangContext)
  useEffect(() => {
    fetchQuantities()
  }, [quantityCreatedState])
  const fetchQuantities = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/quantity-type', {
        headers: {
          store: '1',
        },
      })
      if (response.ok) {
        const responseData = await response.json()
        setResponseData(responseData)
        if (responseData.data && Array.isArray(responseData.data)) {
          const fetchedQuantityOptions = responseData.data.map(
            (quantity: any) => `${quantity.value} ${quantity.size}`
          )
          setQuantityOptions(fetchedQuantityOptions)
        } else {
          console.error('Invalid API response data:', responseData)
        }
      } else {
        console.error('Failed to fetch quantities:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching quantities:', error)
    }
  }
  const itItemInvalid = (item: Item) => {
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
    if (field === 'quantity') {
      if (responseData) {
        const selectedQuantityIndex = quantityOptions.indexOf(value)
        if (selectedQuantityIndex !== -1) {
          const selectedQuantityType = responseData.data[selectedQuantityIndex]
          newItems[index] = {
            ...newItems[index],
            [field]: value,
            quantityTypeId: selectedQuantityType.id,
          }
        } else {
          console.error("Selected quantity doesn't exist in quantityOptions")
        }
      }
    } else {
      newItems[index] = { ...newItems[index], [field]: value }
    }
    setItems(newItems)
  }

  const handleAddItem = () => {
    const lastItem = items[items.length - 1]
    if (!itItemInvalid(lastItem) && isValidPrice(lastItem)) {
      setItems([...items, defaultItem])
    } else {
      alert(appLang['feature.manualAdditionPage.alerts'][1])
    }
  }

  const handleAddInventory = async () => {
    if (items.length == 0) {
      alert('Please add items before submitting.')
      return
    }
    const lastItem = items[items.length - 1]
    if (lastItem.costPrice >= lastItem.sellingPrice) {
      alert(
        'The cost price of the last item must be less than the selling price.'
      )
      return
    }
    const itemsToSend = items.map((item) => ({
      name: item.itemName,
      cost_price: item.costPrice,
      sale_price: item.sellingPrice,
      quantity_type_id: item.quantityTypeId,
    }))
    try {
      for (const item of itemsToSend) {
        // console.log('Sending item:', item)
        await fetch('http://localhost:8000/api/item/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            store: '1',
          },
          body: JSON.stringify(item),
        })
      }
      setItems([defaultItem])
      alert('Items have been created successfully.')
    } catch (error) {
      // console.error('Error in my API call:', error)
      alert('Error occurred while creating items. Please try again later.')
    }
  }

  const isValidPrice = (item: Item) => {
    return item.sellingPrice >= item.costPrice
  }

  const handleOpenModal = () => {
    setQuantityModalOpen(true)
  }

  const handleCloseModal = () => {
    setQuantityModalOpen(false)
    setNewQuantity('')
    setNewUnit('')
  }

  const handleAddQuantityModalSubmit = () => {
    if ((newUnit === 'L' || newUnit === 'Kg') && parseInt(newQuantity) > 3) {
      setInvalidQuantityError(
        appLang['feature.manualAdditionPage.quantityRestrictionMessages'][0]
      )
      return
    } else if (
      (newUnit === 'g' || newUnit === 'ml') &&
      parseInt(newQuantity) > 10000
    ) {
      setInvalidQuantityError(
        appLang['feature.manualAdditionPage.quantityRestrictionMessages'][1]
      )
      return
    }
    if (newQuantity && newUnit) {
      const payload = {
        size: newUnit,
        value: parseFloat(newQuantity),
      }

      fetch('http://localhost:8000/api/quantity-type', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          store: '1',
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok')
          }
          return response.json()
        })
        .then((data) => {
          console.log('Success:', data)

          console.log('quantityOptions before update:', quantityOptions)
          setQuantityOptions([...quantityOptions, `${newQuantity} ${newUnit}`])
          setQuantityCreatedState(!quantityCreatedState)
          console.log('quantityOptions after update:', quantityOptions)
        })
        .catch((error) => {
          console.error('Error:', error)
        })
      handleCloseModal()
    }
  }

  const columns = [
    {
      id: 'itemName',
      label: appLang['feature.item.screens.table.headers'][0],
      component: (data: any, rowIndex: number) => (
        <TextField
          type="text"
          value={data}
          onChange={(e) =>
            handleItemChange(rowIndex, 'itemName', e.target.value)
          }
          fullWidth
        />
      ),
    },
    {
      id: 'costPrice',
      label: appLang['feature.item.screens.table.headers'][1],
      component: (data: any, rowIndex: number) => (
        <TextField
          type="number"
          value={data}
          onChange={(e) =>
            handleItemChange(rowIndex, 'costPrice', Number(e.target.value))
          }
          fullWidth
        />
      ),
    },
    {
      id: 'sellingPrice',
      label: appLang['feature.item.screens.table.headers'][2],
      component: (data: any, rowIndex: number) => (
        <TextField
          type="number"
          value={data}
          onChange={(e) =>
            handleItemChange(rowIndex, 'sellingPrice', Number(e.target.value))
          }
          fullWidth
        />
      ),
    },
    {
      id: 'quantity',
      label: (
        <React.Fragment>
          {appLang['feature.item.screens.table.headers'][3]}{' '}
          <Tooltip
            title={appLang['feature.item.screens.tooltip&placeholders'][0]}
          >
            <IconButton onClick={handleOpenModal}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        </React.Fragment>
      ),
      component: (data: any, rowIndex: number) => (
        <Autocomplete
          value={data}
          onChange={(event, value) =>
            handleItemChange(rowIndex, 'quantity', value)
          }
          options={quantityOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Quantity"
              fullWidth
              placeholder={
                appLang['feature.item.screens.tooltip&placeholders'][2]
              }
            />
          )}
        />
      ),
    },
    {
      id: 'actions',
      label: appLang['feature.item.screens.table.headers'][5],
      component: (rowIndex: number) => (
        <>
          <Tooltip
            title={appLang['feature.item.screens.tooltip&placeholders'][1]}
          >
            <IconButton
              onClick={() => handleDeleteItem(rowIndex)}
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ]
  return (
    <>
      <CommonTable
        columns={columns}
        rows={items.map((item) => [
          item.itemName,
          item.costPrice,
          item.sellingPrice,
          item.quantity,
          // Empty value for actions column
          '',
        ])}
        title={appLang['feature.manualAdditionPage.title']}
      />
      <Button onClick={handleAddItem} variant="contained" color="primary">
        {appLang['feature.common.templates.addItem.button']}
      </Button>
      <div className="add-item-button-container">
        <Button
          onClick={handleAddInventory}
          variant="contained"
          color="primary"
        >
          {appLang['feature.common.templates.addItems.button']}
        </Button>{' '}
      </div>
      <QuantityModal
        open={quantityModalOpen}
        handleClose={handleCloseModal}
        newQuantity={newQuantity}
        setNewQuantity={setNewQuantity}
        newUnit={newUnit}
        setNewUnit={setNewUnit}
        error={invalidQuantityError}
        handleModalSubmit={handleAddQuantityModalSubmit}
      />
    </>
  )
}

export default ManualAdditionComponent
