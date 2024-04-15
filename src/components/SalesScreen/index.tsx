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

interface ItemRow {
  id: number
  itemDetail: string
  quantity: number
  rate: number
  total: number
}
interface Item {
  id: number
  name: string
}

export interface FormData {
  customerName: string
  salesOrderDate: string
  itemRows: ItemRow[]
  paymentMode: string
  discountType: string
  discountValue: number
  paidAmount: string
  totalAmount: number
}

const SalesScreen: React.FC = () => {
  const initialFormData: FormData = {
    customerName: '',
    salesOrderDate: new Date().toISOString().split('T')[0],
    itemRows: [],
    paymentMode: '',
    discountType: '',
    discountValue: 0,
    paidAmount: '',
    totalAmount: 0,
  }

  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [openResetConfirmation, setOpenResetConfirmation] = useState(false)
  const [drafts, setDrafts] = useState<FormData[]>([])
  const [openDraftsModal, setOpenDraftsModal] = useState(false)
  const [idCounter, setIdCounter] = useState<number>(0)
  const { appLang } = useContext(AppLangContext)
  const { appConfig } = useContext<IAppStateContext>(AppStateContext)
  const [items, setItems] = useState<Item[]>([])
  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/items', {
        headers: {
          store: '1',
        },
      })
      if (response.ok) {
        const data = await response.json()
        setItems(data.data)
      } else {
        console.error('Failed to fetch items')
      }
    } catch (error) {
      console.error('Error fetching items:', error)
    }
  }
  const addItemRow = () => {
    if (formData.itemRows.length > 0) {
      const lastItem = formData.itemRows[formData.itemRows.length - 1]
      if (
        !lastItem.itemDetail ||
        lastItem.quantity === 0 ||
        lastItem.rate === 0
      ) {
        alert(
          'Please fill all three fields for the previous item before adding a new one.'
        )
        return
      }
    }
    const newItemRow: ItemRow = {
      id: idCounter + 1,
      itemDetail: '',
      quantity: 0,
      rate: 0,
      total: 0,
    }

    setFormData((prevState) => ({
      ...prevState,
      itemRows: [...prevState.itemRows, newItemRow],
    }))

    setIdCounter((prevCounter) => prevCounter + 1)
  }

  const deleteItemRow = (id: number) => {
    setFormData((prevState) => ({
      ...prevState,
      itemRows: prevState.itemRows.filter((row) => row.id !== id),
    }))

    setIdCounter((prevCounter) => prevCounter - 1)
  }
  const findItemByName = (name: string) => {
    return items.find((item) => item.name === name) || null
  }

  const handleResetConfirmationClose = () => {
    setOpenResetConfirmation(false)
  }

  const handleResetConfirmationConfirm = () => {
    setOpenResetConfirmation(false)
    setFormData(initialFormData)
  }
  const handleDraftsModalClose = () => {
    setOpenDraftsModal(false)
  }

  const deleteDraft = (index: number) => {
    const updatedDrafts = [...drafts]
    updatedDrafts.splice(index, 1)
    setDrafts(updatedDrafts)
  }
  const handleItemChange = (
    id: number,
    field: keyof ItemRow,
    value: string | Item | null
  ) => {
    if (field === 'itemDetail') {
      const selectedItem = value as Item | null
      const selectedName = selectedItem ? selectedItem.name : ''
      setFormData((prevState) => ({
        ...prevState,
        itemRows: prevState.itemRows.map((row) =>
          row.id === id ? { ...row, itemDetail: selectedName } : row
        ),
      }))
    } else {
      setFormData((prevState) => ({
        ...prevState,
        itemRows: prevState.itemRows.map((row) => {
          if (row.id === id) {
            const newValue = parseFloat(value as string)
            const quantity = field === 'quantity' ? newValue : row.quantity
            const rate = field === 'rate' ? newValue : row.rate
            const total = quantity * rate
            return { ...row, [field]: newValue, total }
          }
          return row
        }),
      }))
    }
  }

  const totalAmount = formData.itemRows.reduce(
    (acc, curr) => acc + curr.total,
    0
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
    const hasIncompleteItem = formData.itemRows.some(
      (item) => !item.itemDetail || item.quantity === 0 || item.rate === 0
    )

    if (hasIncompleteItem) {
      alert('Please fill all three fields for all items before submission.')
      return
    }
    if (
      !formData.customerName ||
      !formData.paymentMode ||
      !formData.paidAmount
    ) {
      alert(
        'Please fill all required fields (Customer Name, Payment Mode, and Paid Amount).'
      )
      return
    }

    const itemsData = formData.itemRows.map((row) => ({
      item_id: findItemByName(row.itemDetail)?.id,
      quantity: row.quantity,
      total_amount: row.total,
    }))

    const requestData = {
      vendor_name: formData.customerName,
      payment_method: formData.paymentMode,
      discount: {
        discount_type: formData.discountType,
        amount: formData.discountValue,
      },
      paid_amount: formData.paidAmount,
      total_amount: totalAmount,
      items: itemsData,
      status: 'Active',
    }

    try {
      const response = await fetch('http://localhost:8000/api/sale', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          store: '1',
        },
        body: JSON.stringify(requestData),
      })

      if (response.ok) {
        alert('Sale submitted successfully!')
        setFormData(initialFormData)
      } else {
        console.error('Failed to submit sale:', response.statusText)
        alert('Failed to submit sale. Please try again later.')
      }
    } catch (error) {
      console.error('Error submitting sale:', error)
      alert(
        'Failed to submit sale. Please check your network connection and try again.'
      )
    }
  }

  const saveAsDraft = () => {
    setDrafts([...drafts, formData])
    setFormData(initialFormData)
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
        <IconButton onClick={() => setOpenDraftsModal(true)}>
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
          />
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
      {formData.itemRows.length > 0 && (
        <Grid item xs={12}>
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
              {formData.itemRows.map((row, index) => (
                <TableRow key={`${row.id}-${index}`}>
                  <TableCell>
                    <TextField
                      fullWidth
                      select
                      value={row.itemDetail}
                      onChange={(e) =>
                        handleItemChange(row.id, 'itemDetail', e.target.value)
                      }
                      SelectProps={{
                        displayEmpty: true,
                        renderValue: (value) =>
                          value === '' ? 'Select Item' : value,
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Item
                      </MenuItem>
                      {items.map((item) => (
                        <MenuItem key={item.id} value={item}>
                          {item.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      type="number"
                      value={row.quantity}
                      onChange={(e) =>
                        handleItemChange(row.id, 'quantity', e.target.value)
                      }
                      InputProps={{ inputProps: { min: 1 } }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      fullWidth
                      type="number"
                      value={row.rate}
                      onChange={(e) =>
                        handleItemChange(row.id, 'rate', e.target.value)
                      }
                      InputProps={{ inputProps: { min: 1 } }}
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
        </Grid>
      )}
      <Grid item xs={12}>
        <Box display="flex" justifyContent="center">
          <Button onClick={addItemRow} variant="contained" sx={{ my: 3 }}>
            {appLang['feature.salesScreen.addItemButton']}
          </Button>
        </Box>
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
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" my={5} className="totalAmount">
            {appLang['feature.salesScreen.totalAmountLabel']}{' '}
            {(formData.discountType === 'percentage'
              ? totalAmount - (formData.discountValue / 100) * totalAmount
              : totalAmount - formData.discountValue
            ).toFixed(2)}
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
        onClose={handleDraftsModalClose}
        drafts={drafts}
        deleteDraft={deleteDraft}
      />
    </Box>
  )
}

export default SalesScreen
