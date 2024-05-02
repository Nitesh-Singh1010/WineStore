import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormHelperText,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { v4 as uuidv4 } from 'uuid'

import FileUpload from './FileUpload'
import './index.scss'
import ResetConfirmationDialog from '@components/common/ResetConfirmationDialog/ResetConfirmationDialog'
import DraftsDialog from '@components/PurchaseScreen/DraftsDialog'

import { AppLangContext } from '@Contexts'

import React, { useState, useContext, useEffect } from 'react'
interface ItemRow {
  id: string
  itemDetail: string
  quantity: number
  purchase_price: number
  sale_price: number
  total: number
}

export interface FormData {
  vendorName: string
  purchaseDate: string
  itemRows: ItemRow[]
  paymentMode: string
  discountType: string
  discountValue: number
  paidAmount: number
  totalAmount: number
}

const PurchaseScreen: React.FC = () => {
  const initialFormData: FormData = {
    vendorName: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    itemRows: [
      // adding an initial row
      {
        id: uuidv4(),
        itemDetail: '',
        quantity: 0,
        purchase_price: 0,
        sale_price: 0,
        total: 0,
      },
    ],
    paymentMode: '',
    discountType: '',
    discountValue: 0,
    paidAmount: 0,
    totalAmount: 0,
  }
  const { appLang } = useContext(AppLangContext)

  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [files, setFiles] = useState<File[]>([])
  const [openResetConfirmation, setOpenResetConfirmation] = useState(false)
  const [openDraftsModal, setOpenDraftsModal] = useState(false)
  const [itemNames, setItemNames] = useState<string[]>([])
  const [itemDetails, setItemDetails] = useState<any[]>([])
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [selectedItemNames, setSelectedItemNames] = useState<string[]>([])
  const urlParams = new URLSearchParams(window.location.search)
  const draftId = urlParams.get('draftId')
  useEffect(() => {
    fetchItemNames()
  }, [])
  useEffect(() => {
    if (draftId) {
      fetchTransactionData(draftId)
    }
  }, [draftId])

  const fetchTransactionData = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/transaction/${id}`,
        {
          headers: {
            store: '1',
          },
        }
      )
      if (!response.ok) {
        throw new Error('Failed to fetch transaction data')
      }
      const responseData = await response.json()
      const transactionData = responseData.data

      setFormData({
        vendorName: transactionData.vendor_name,
        purchaseDate: transactionData.created_at.split('T')[0],
        itemRows: transactionData.transaction_items.map((item: any) => ({
          id: item.id,
          itemDetail: item.item.identifier,
          quantity: item.quantity,
          purchase_price: parseFloat(item.item.cost_price),
          sale_price: parseFloat(item.item.sale_price),
          total: item.quantity * parseFloat(item.item.cost_price),
        })),
        paymentMode: transactionData.payment_method,
        discountType: transactionData.discount?.discount_type || '',
        discountValue: transactionData.discount?.amount || 0,
        paidAmount: transactionData.paid_amount,
        totalAmount: transactionData.total_amount,
      })
    } catch (error) {
      console.error('Error fetching transaction data:', error)
    }
  }
  const fetchItemNames = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/items', {
        headers: {
          store: '1',
        },
      })
      const responseData = await response.json()
      setItemDetails(responseData.data)
      const names = responseData.data.map((item: any) => item.identifier)
      setItemNames(names)
    } catch (error) {
      console.error('Error fetching item names:', error)
    }
  }
  const addItemRow = () => {
    setFormData((prevState) => ({
      ...prevState,
      itemRows: [
        ...prevState.itemRows,
        {
          id: uuidv4(),
          itemDetail: '',
          quantity: 0,
          purchase_price: 0,
          sale_price: 0,
          total: 0,
        },
      ],
    }))
  }

  const deleteItemRow = (id: string) => {
    setFormData((prevState) => ({
      ...prevState,
      itemRows: prevState.itemRows.filter((row) => row.id !== id),
    }))
  }
  const handleItemChange = (
    id: string,
    field: keyof ItemRow,
    value: string
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      itemRows: prevState.itemRows.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value, total: 0 }

          if (field === 'itemDetail') {
            updatedRow.quantity = 0
            const previousItemName = row.itemDetail
            if (previousItemName) {
              setSelectedItemNames((prevNames) =>
                prevNames.filter((name) => name !== previousItemName)
              )
            }

            const selectedItem = itemDetails.find(
              (item: any) => item.identifier === value
            )

            if (selectedItem) {
              updatedRow.purchase_price = parseFloat(selectedItem.cost_price)
              updatedRow.sale_price = parseFloat(selectedItem.sale_price)
            }
            setSelectedItemNames((prevNames) => [...prevNames, value])
          } else if (field === 'quantity') {
            updatedRow.total =
              parseFloat(updatedRow.purchase_price) * parseFloat(value)
          }
          return updatedRow
        }
        return row
      }),
    }))
  }

  const calculateTotalAmount = (itemRows: ItemRow[], discountValue: number) => {
    let discount = 0
    if (formData.discountType === 'percentage') {
      discount =
        itemRows.reduce((acc, curr) => acc + curr.total, 0) *
        (discountValue / 100)
    } else {
      discount = discountValue
    }
    return Math.max(
      0,
      itemRows.reduce((acc, curr) => acc + curr.total, 0) - discount
    )
  }
  const totalAmount = calculateTotalAmount(
    formData.itemRows,
    formData.discountValue
  )

  const handleDiscountTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const discountType: string = event.target.value as string
    setFormData((prevState) => ({
      ...prevState,
      discountType,
      discountValue: 0,
    }))
  }

  const handleDiscountValueChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const discountValue = parseFloat(event.target.value)
    setFormData((prevState) => ({
      ...prevState,
      discountValue,
    }))
  }
  const getItemIdByName = (itemName) => {
    const selectedItem = itemDetails.find(
      (item) => item.identifier === itemName
    )
    return selectedItem ? selectedItem.id : null
  }
  const handleSubmit = async () => {
    setFormSubmitted(true)
    const requiredFields = [
      'vendorName',
      'purchaseDate',
      'paymentMode',
      'paidAmount',
    ]
    const emptyFields = requiredFields.filter((field) => !formData[field])
    if (emptyFields.length > 0) {
      return
    }
    if (draftId) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/transaction/${draftId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              store: '1',
            },
            body: JSON.stringify({
              vendor_name: formData.vendorName,
              payment_method: formData.paymentMode,
              discount: {
                discount_type:
                  formData.discountType === 'percentage'
                    ? 'percentage'
                    : 'absolute',
                amount: formData.discountValue,
              },
              paid_amount: formData.paidAmount,
              total_amount: totalAmount - formData.discountValue,
              items: formData.itemRows.map((row) => ({
                item_id: getItemIdByName(row.itemDetail),
                quantity: row.quantity,
                total_amount: row.total,
              })),
              status: 'Active',
            }),
          }
        )

        if (!response.ok) {
          throw new Error('Failed to make purchase')
        } else {
          alert('Draft Purchased Succesfully')
          setFormData(initialFormData)
        }
      } catch (error) {
        console.error('Error making purchase:', error)
      }
    } else {
      try {
        const response = await fetch('http://localhost:8000/api/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            store: '1',
          },
          body: JSON.stringify({
            vendor_name: formData.vendorName,
            payment_method: formData.paymentMode,
            discount: {
              discount_type:
                formData.discountType === 'percentage'
                  ? 'percentage'
                  : 'absolute',
              amount: formData.discountValue,
            },
            paid_amount: formData.paidAmount,
            total_amount: totalAmount - formData.discountValue,
            items: formData.itemRows.map((row) => ({
              item_id: getItemIdByName(row.itemDetail),
              quantity: row.quantity,
              total_amount: row.total,
            })),
            status: 'Active',
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to make purchase')
        } else {
          alert('Purchased Succesfully')
          setFormData(initialFormData)
        }
      } catch (error) {
        console.error('Error making purchase:', error)
      }
    }
  }

  const handleResetConfirmationClose = () => {
    setOpenResetConfirmation(false)
  }

  const handleResetConfirmationConfirm = () => {
    setOpenResetConfirmation(false)
    setFormData(initialFormData)
  }

  const handleViewDrafts = () => {
    setOpenDraftsModal(true)
  }

  const saveAsDraft = async () => {
    const isFormEmpty = Object.values(formData).every(
      (value) => value === initialFormData[value]
    )

    if (isFormEmpty) {
      alert('The form is empty.')
      return
    }

    const requiredFields = [
      'vendorName',
      'purchaseDate',
      'paymentMode',
      'paidAmount',
    ]
    const emptyFields = requiredFields.filter((field) => !formData[field])
    if (emptyFields.length > 0) {
      return
    }
    if (draftId) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/transaction/${draftId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              store: '1',
            },
            body: JSON.stringify({
              vendor_name: formData.vendorName,
              payment_method: formData.paymentMode,
              discount: {
                discount_type:
                  formData.discountType === 'percentage'
                    ? 'percentage'
                    : 'absolute',
                amount: formData.discountValue,
              },
              paid_amount: formData.paidAmount,
              total_amount: totalAmount - formData.discountValue,
              items: formData.itemRows.map((row) => ({
                item_id: getItemIdByName(row.itemDetail),
                quantity: row.quantity,
                total_amount: row.total,
              })),
              status: 'Draft',
            }),
          }
        )

        if (!response.ok) {
          throw new Error('Failed to make purchase')
        } else {
          alert('Draft Updated Succesfully')
          // setFormData(initialFormData)
        }
      } catch (error) {
        console.error('Error updating draft:', error)
      }
    } else {
      try {
        const response = await fetch('http://localhost:8000/api/purchase', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            store: '1',
          },
          body: JSON.stringify({
            vendor_name: formData.vendorName,
            payment_method: formData.paymentMode,
            discount: {
              discount_type:
                formData.discountType === 'percentage'
                  ? 'percentage'
                  : 'absolute',
              amount: formData.discountValue,
            },
            paid_amount: formData.paidAmount,
            total_amount: totalAmount - formData.discountValue,
            items: formData.itemRows.map((row) => ({
              item_id: getItemIdByName(row.itemDetail),
              quantity: row.quantity,
              total_amount: row.total,
            })),
            status: 'Draft',
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to save as Draft')
        }
        alert('Draft Saved Succesfully')
        setFormData(initialFormData)
      } catch (error) {
        console.error('Error saving Draft:', error)
      }
    }
  }
  return (
    <Box sx={{ margin: 2 }}>
      <div className="heading">
        <Typography variant="h4" component="h1">
          Make a purchase
        </Typography>
        <IconButton onClick={handleViewDrafts} className="viewDraftsButton">
          <ArrowDropDownIcon />
          <Typography>
            {appLang['features.purchaseScreenMessages.draftDialogTitle']}
          </Typography>
        </IconButton>
      </div>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Vendor Name"
            value={formData.vendorName}
            onChange={(e) =>
              setFormData({ ...formData, vendorName: e.target.value })
            }
            margin="normal"
            required
            error={formSubmitted && !formData.vendorName}
          />
          {formSubmitted && !formData.vendorName && (
            <FormHelperText style={{ color: 'red' }}>
              Vendor Name is required.
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="Purchase Date"
            required
            InputLabelProps={{ shrink: true }}
            value={formData.purchaseDate}
            onChange={(e) =>
              setFormData({ ...formData, purchaseDate: e.target.value })
            }
            margin="normal"
            inputProps={{ max: new Date().toISOString().split('T')[0] }}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {' '}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="50%">
                  {appLang['features.purchaseScreenMessages.itemDetail']}
                </TableCell>
                <TableCell>
                  {appLang['features.purchaseScreenMessages.quantity']}
                </TableCell>
                <TableCell>
                  {appLang['features.purchaseScreenMessages.purchasePrice']}
                </TableCell>
                <TableCell>
                  {appLang['features.purchaseScreenMessages.sellingPrice']}
                </TableCell>
                <TableCell>
                  {appLang['features.purchaseScreenMessages.total']}
                </TableCell>
                <TableCell>
                  {appLang['features.purchaseScreenMessages.action']}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.itemRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <TextField
                      fullWidth
                      select
                      required
                      label="Select Items"
                      value={row.itemDetail}
                      onChange={(e) =>
                        handleItemChange(row.id, 'itemDetail', e.target.value)
                      }
                    >
                      {itemNames.map((itemName, index) => (
                        <MenuItem
                          key={index}
                          value={itemName}
                          disabled={selectedItemNames.includes(itemName)}
                        >
                          {itemName}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      type="number"
                      value={row.quantity}
                      required
                      onChange={(e) =>
                        handleItemChange(row.id, 'quantity', e.target.value)
                      }
                      InputProps={{ inputProps: { min: 1 } }}
                      error={formSubmitted && row.quantity == 0}
                    />
                    {formSubmitted && row.quantity == 0 && (
                      <FormHelperText style={{ color: 'red' }}>
                        Quantity is Required.
                      </FormHelperText>
                    )}
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      type="number"
                      InputProps={{
                        readOnly: true,
                      }}
                      value={row.purchase_price}
                      onChange={(e) =>
                        handleItemChange(
                          row.id,
                          'purchase_price',
                          e.target.value
                        )
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      type="number"
                      InputProps={{
                        readOnly: true,
                      }}
                      value={row.sale_price}
                      onChange={(e) =>
                        handleItemChange(row.id, 'sale_price', e.target.value)
                      }
                    />
                  </TableCell>
                  <TableCell>{row.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => deleteItemRow(row.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box className="addItemContainer">
            <Button
              onClick={addItemRow}
              variant="contained"
              className="addItemButton"
            >
              Add Item
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="payment-mode-label">
              {appLang['features.purchaseScreenMessages.paymentMode']}
            </InputLabel>
            <Select
              labelId="payment-mode-label"
              value={formData.paymentMode}
              label="Payment Mode"
              onChange={(e) =>
                setFormData({ ...formData, paymentMode: e.target.value })
              }
            >
              <MenuItem value="Cash">
                {appLang['features.purchaseScreenMessages.cash']}
              </MenuItem>
              <MenuItem value="Card">
                {appLang['features.purchaseScreenMessages.card']}
              </MenuItem>
              <MenuItem value="UPI">
                {appLang['features.purchaseScreenMessages.upi']}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Discount Type</InputLabel>
                <Select
                  value={formData.discountType}
                  onChange={handleDiscountTypeChange}
                >
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="absolute">Absolute</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label={`Discount (${formData.discountType === 'percentage' ? '%' : 'Rs.'})`}
                type="number"
                value={formData.discountValue}
                onChange={handleDiscountValueChange}
                margin="normal"
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Paid Amount"
            value={formData.paidAmount}
            onChange={(e) =>
              setFormData({ ...formData, paidAmount: e.target.value })
            }
            margin="normal"
            required
            error={formSubmitted && !formData.paidAmount}
          />
          {formSubmitted && !formData.paidAmount && (
            <FormHelperText style={{ color: 'red' }}>
              Paid Amount is required.
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} md={10}>
          <Typography variant="h6" className="totalAmountText">
            {appLang['features.purchaseScreenMessages.totalAmountLabel']}{' '}
            {totalAmount.toFixed(2)}
          </Typography>
        </Grid>

        <FileUpload files={files} setFiles={setFiles} />
        <Grid item xs={12}>
          <Box className="buttonContainer">
            <Button
              variant="contained"
              color="secondary"
              className="button resetButton"
              onClick={() => setOpenResetConfirmation(true)}
            >
              Reset
            </Button>
            <Button
              onClick={saveAsDraft}
              variant="contained"
              className="button"
            >
              Save as Draft
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              className="button purchaseButton"
            >
              Purchase
            </Button>
          </Box>
        </Grid>
      </Grid>
      <ResetConfirmationDialog
        open={openResetConfirmation}
        onClose={handleResetConfirmationClose}
        onConfirm={handleResetConfirmationConfirm}
      />
      <DraftsDialog
        open={openDraftsModal}
        onClose={() => setOpenDraftsModal(false)}
        apiEndpoint="http://localhost:8000/api/draft-transactions?txn_type=Purchase"
      />
    </Box>
  )
}

export default PurchaseScreen
