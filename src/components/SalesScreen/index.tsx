import React, { useContext, useState, useEffect } from 'react'
import {
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  FormHelperText,
  Typography,
  ListItemIcon,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { AppStateContext, IAppStateContext, AppLangContext } from '@Contexts'
import './index.scss'
import ResetConfirmationDialog from '@components/common/ResetConfirmationDialog/ResetConfirmationDialog'
import DraftsDialog from './DraftsDialog'
import { v4 as uuidv4 } from 'uuid'

interface ItemRow {
  id: number
  itemDetail: string
  quantity: number
  rate: number
  total: number
}

export interface FormData {
  customerName: string
  salesOrderDate: string
  itemRows: ItemRow[]
  paymentMode: string
  discountType: string
  discountValue: number
  paidAmount: number
  totalAmount: number
}

const SalesScreen: React.FC = () => {
  const initialFormData: FormData = {
    customerName: '',
    salesOrderDate: new Date().toISOString().split('T')[0],
    itemRows: [
      {
        id: uuidv4(),
        itemDetail: '',
        quantity: 0,
        rate: 0,
        total: 0,
      },
    ],
    paymentMode: '',
    discountType: '',
    discountValue: 0,
    paidAmount: 0,
    totalAmount: 0,
  }

  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [openResetConfirmation, setOpenResetConfirmation] = useState(false)

  const [openDraftsModal, setOpenDraftsModal] = useState(false)

  const { appLang } = useContext(AppLangContext)
  const { appConfig } = useContext<IAppStateContext>(AppStateContext)

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
        customerName: transactionData.vendor_name,
        salesOrderDate: transactionData.created_at.split('T')[0],
        itemRows: transactionData.transaction_items.map((item: any) => ({
          id: item.id,
          itemDetail: item.item.identifier,
          quantity: item.quantity,
          rate: parseFloat(item.item.sale_price),
          total: item.quantity * parseFloat(item.item.sale_price),
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
          rate: 0,
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
  const getItemIdByName = (itemName) => {
    const selectedItem = itemDetails.find(
      (item) => item.identifier === itemName
    )
    return selectedItem ? selectedItem.id : null
  }

  const handleResetConfirmationClose = () => {
    setOpenResetConfirmation(false)
  }

  const handleResetConfirmationConfirm = () => {
    setOpenResetConfirmation(false)
    setFormData(initialFormData)
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
              updatedRow.rate = parseFloat(selectedItem.sale_price)
            }
            setSelectedItemNames((prevNames) => [...prevNames, value])
          } else if (field === 'quantity') {
            updatedRow.total = parseFloat(updatedRow.rate) * parseFloat(value)
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
  const handleSubmit = async () => {
    setFormSubmitted(true)
    const requiredFields = [
      'customerName',
      'salesOrderDate',
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
              vendor_name: formData.customerName,
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
          alert('Draft sold Succesfully')
          setFormData(initialFormData)
        }
      } catch (error) {
        console.error('Error making purchase:', error)
      }
    } else {
      try {
        const response = await fetch('http://localhost:8000/api/sale', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            store: '1',
          },
          body: JSON.stringify({
            vendor_name: formData.customerName,
            payment_method: formData.paymentMode,
            discount: {
              discount_type: formData.discountType,
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
      'customerName',
      'salesOrderDate',
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
              vendor_name: formData.customerName,
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
        const response = await fetch('http://localhost:8000/api/sale', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            store: '1',
          },
          body: JSON.stringify({
            vendor_name: formData.customerName,
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
  const handlePrintBill = () => {
    alert('Printing Bill...')
  }
  return (
    <Box sx={{ margin: 2 }}>
      <div className="heading">
        <Typography variant="h4" component="h1">
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          {appLang['feature.salesScreen.salesOrderTitle']}
        </Typography>
        <IconButton onClick={handleViewDrafts} className="viewDraftsButton">
          <ArrowDropDownIcon />
          <Typography>{appLang['feature.salesScreen.viewDrafts']}</Typography>
        </IconButton>
      </div>
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label={appLang['feature.salesScreen.customerNameLabel']}
            value={formData.customerName}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
            margin="normal"
            required
            error={formSubmitted && !formData.customerName}
          />
          {formSubmitted && !formData.customerName && (
            <FormHelperText style={{ color: 'red' }}>
              Vendor Name is required.
            </FormHelperText>
          )}
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label={appLang['feature.salesScreen.salesOrderDateLabel']}
            InputLabelProps={{ shrink: true }}
            value={formData.salesOrderDate}
            onChange={(e) =>
              setFormData({ ...formData, salesOrderDate: e.target.value })
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
                  {appLang['feature.salesScreen.itemDetailColumnName']}
                </TableCell>
                <TableCell>
                  {appLang['feature.salesScreen.quantityColumnName']}
                </TableCell>
                <TableCell>
                  {appLang['feature.salesScreen.rateColumnName']}
                </TableCell>
                <TableCell>
                  {appLang['feature.salesScreen.totalColumnName']}
                </TableCell>
                <TableCell>
                  {appLang['feature.salesScreen.actionColumnName']}
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
                      value={row.rate}
                      onChange={(e) =>
                        handleItemChange(row.id, 'rate', e.target.value)
                      }
                      InputProps={{
                        readOnly: true,
                      }}
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
              {appLang['feature.salesScreen.paymentModeLabel']}
            </InputLabel>
            <Select
              labelId="payment-mode-label"
              value={formData.paymentMode}
              label={appLang['feature.salesScreen.paymentModeLabel']}
              onChange={(e) =>
                setFormData({ ...formData, paymentMode: e.target.value })
              }
            >
              <MenuItem value="Cash">
                {appConfig['feature.paymentModes'][0]}
              </MenuItem>
              <MenuItem value="Card">
                {appConfig['feature.paymentModes'][1]}
              </MenuItem>
              <MenuItem value="UPI">
                {appConfig['feature.paymentModes'][2]}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>
                  {appLang['feature.salesScreen.discountTypeLabel']}
                </InputLabel>
                <Select
                  value={formData.discountType}
                  onChange={handleDiscountTypeChange}
                >
                  <MenuItem value="percentage">
                    {
                      appLang['feature.salesScreen.discountValueLabel']
                        .percentage
                    }
                  </MenuItem>
                  <MenuItem value="absolute">
                    {appLang['feature.salesScreen.discountValueLabel'].absolute}
                  </MenuItem>
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
            label={appLang['feature.salesScreen.paidAmountLabel']}
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
        <Grid item xs={12} md={6}>
          <Typography variant="h6" my={5} className="totalAmount">
            {appLang['feature.salesScreen.totalAmountLabel']}{' '}
            {totalAmount.toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box className="buttonBox">
            <Button
              onClick={handlePrintBill}
              variant="contained"
              color="primary"
              sx={{ mt: 2, mr: 2 }}
            >
              {appLang['feature.salesScreen.printBillButton']}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2, mr: 2 }}
              onClick={() => setOpenResetConfirmation(true)}
            >
              {appLang['feature.salesScreen.resetButton']}
            </Button>
            <Button
              onClick={saveAsDraft}
              variant="contained"
              sx={{ mt: 2, mr: 2 }}
            >
              {appLang['feature.salesScreen.saveDraftButton']}
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              {appLang['feature.salesScreen.confirmButton']}
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
        apiEndpoint="http://localhost:8000/api/draft-transactions?txn_type=Sale"
      />
    </Box>
  )
}
export default SalesScreen
