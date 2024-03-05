import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'

interface ItemRow {
  id: number
  itemDetail: string
  quantity: number
  rate: number
  total: number
}

interface FormData {
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
  const [files, setFiles] = useState<File[]>([])
  const [openResetConfirmation, setOpenResetConfirmation] = useState(false)
  const [drafts, setDrafts] = useState<FormData[]>([])
  const [openDraftsModal, setOpenDraftsModal] = useState(false)
  const [idCounter, setIdCounter] = useState<number>(0)

  useEffect(() => {
    // Load customer name from local storage
    const storedCustomerName = localStorage.getItem('customerName')
    if (storedCustomerName) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        customerName: storedCustomerName,
      }))
    }

    // Add one default item row when component mounts
    addItemRow()
  }, [])
  const addItemRow = () => {
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

    setIdCounter((prevCounter) => prevCounter - 1) // Decrement the counter
  }

  const handleItemChange = (
    id: number,
    field: keyof ItemRow,
    value: string
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      itemRows: prevState.itemRows.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value }

          if (['quantity', 'rate'].includes(field)) {
            const total = updatedRow.quantity * updatedRow.rate
            return { ...updatedRow, total }
          }
          return updatedRow
        }
        return row
      }),
    }))
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

  const handleSubmit = () => {
    let discountedTotal = totalAmount
    if (formData.discountType === 'percentage') {
      discountedTotal -= (totalAmount * formData.discountValue) / 100
    } else if (formData.discountType === 'absolute') {
      discountedTotal -= formData.discountValue
    }
    console.log('Total after discount:', discountedTotal)
    console.log(formData)
    // Logic to send formData to the backend
  }

  const saveAsDraft = () => {
    // Store customer name in local storage
    localStorage.setItem('customerName', formData.customerName)

    setDrafts([...drafts, formData])
    setFormData(initialFormData) // Resetting the form data to initial state
  }
  const deleteDraft = (index) => {
    const updatedDrafts = [...drafts]
    updatedDrafts.splice(index, 1) // Remove the draft at the specified index
    setDrafts(updatedDrafts) // Update the state
    localStorage.setItem('drafts', JSON.stringify(updatedDrafts)) // Update local storage
  }
  const renderDrafts = () => (
    <Dialog open={openDraftsModal} onClose={() => setOpenDraftsModal(false)}>
      <DialogTitle>Drafts</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Select a draft to load or delete it.
        </DialogContentText>
        <List>
          {drafts.map((draft, index) => (
            <ListItem
              key={index}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => deleteDraft(index)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText primary={draft.customerName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDraftsModal(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  )
  const handlePrintBill = () => {
    // logic to show bill details in a popup window
    // we can use window.open() or any modal library for this purpose
    alert('Printing Bill...')
  }
  return (
    <Box sx={{ margin: 2 }}>
      <div
        className="heading"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1">
          <ListItemIcon>
            <ShoppingCartIcon />
          </ListItemIcon>
          Sales Order
        </Typography>
        <IconButton onClick={() => setOpenDraftsModal(true)}>
          <ArrowDropDownIcon />
          <Typography>View Drafts</Typography>
        </IconButton>
      </div>
      <Grid container spacing={3} mt={2}>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Customer's Name"
            value={formData.customerName}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
            margin="normal"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="Sales Order Date"
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
                <TableCell width="50%">Item Detail</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.itemRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <TextField
                      fullWidth
                      select
                      value={row.itemDetail}
                      onChange={(e) =>
                        handleItemChange(row.id, 'itemDetail', e.target.value)
                      }
                    >
                      <MenuItem value="Item 1">Item 1</MenuItem>
                      <MenuItem value="Item 2">Item 2</MenuItem>
                      <MenuItem value="Item 3">Item 3</MenuItem>
                      <MenuItem value="Item 4">Item 4</MenuItem>
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
            Add Item
          </Button>
        </Box>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="payment-mode-label">Payment Mode</InputLabel>
            <Select
              labelId="payment-mode-label"
              value={formData.paymentMode}
              label="Payment Mode"
              onChange={(e) =>
                setFormData({ ...formData, paymentMode: e.target.value })
              }
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Card">Card</MenuItem>
              <MenuItem value="UPI">UPI</MenuItem>
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
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography
            variant="h6"
            fontWeight="bold"
            textAlign={'center'}
            my={5}
          >
            Total Amount : Rs.{' '}
            {(totalAmount - formData.discountValue).toFixed(2)}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end" marginBottom={4}>
            <Button
              onClick={handlePrintBill}
              variant="contained"
              color="primary"
              sx={{ mt: 2, mr: 2 }}
            >
              Print Bill
            </Button>
            <Button
              variant="contained"
              color="secondary"
              sx={{ mt: 2, mr: 2 }}
              onClick={() => setOpenResetConfirmation(true)}
            >
              Reset
            </Button>
            <Button
              onClick={saveAsDraft}
              variant="contained"
              sx={{ mt: 2, mr: 2 }}
            >
              Save as Draft
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Confirm
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Dialog
        open={openResetConfirmation}
        onClose={() => setOpenResetConfirmation(false)}
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to reset the Order?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenResetConfirmation(false)
              setFormData(initialFormData)
              setFiles([]) // Reset the files state
            }}
            color="primary"
          >
            Yes
          </Button>
          <Button
            onClick={() => setOpenResetConfirmation(false)}
            color="primary"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      {renderDrafts()}
    </Box>
  )
}

export default SalesScreen
