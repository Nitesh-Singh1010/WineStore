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
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { v4 as uuidv4 } from 'uuid'
import React, { useState, useCallback, useContext, useEffect } from 'react'
import FileUpload from './FileUpload'
import './index.scss'
import ResetConfirmationDialog from '@components/common/ResetConfirmationDialog/ResetConfirmationDialog'
import DraftsDialog from '@components/PurchaseScreen/DraftsDialog'
import { calculateTotalAmount } from '../../utils'
import { AppLangContext } from '@Contexts'
import { FormHelperText } from '@mui/material'
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
  paidAmount: string
  totalAmount: number
}

const PurchaseScreen: React.FC = () => {
  const initialFormData: FormData = {
    vendorName: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    itemRows: [],
    paymentMode: '',
    discountType: '',
    discountValue: 0,
    paidAmount: '',
    totalAmount: 0,
  }
  const { appLang } = useContext(AppLangContext)
  const [showAddItemButton, setShowAddItemButton] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [files, setFiles] = useState<File[]>([])
  const [openResetConfirmation, setOpenResetConfirmation] = useState(false)
  const [openDraftsModal, setOpenDraftsModal] = useState(false)
  const [drafts, setDrafts] = useState<FormData[]>([])
  const [itemNames, setItemNames] = useState<string[]>([])
  const [itemDetails, setItemDetails] = useState<any[]>([])
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [successAlert, setSuccessAlert] = useState(false)
  useEffect(() => {
    fetchItemNames()
  }, [])

  const fetchItemNames = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/items', {
        headers: {
          store: '1',
        },
      })
      const responseData = await response.json()
      setItemDetails(responseData.data)
      const names = responseData.data.map((item: any) => item.name)
      setItemNames(names)
    } catch (error) {
      console.error('Error fetching item names:', error)
    }
  }

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([...files, ...acceptedFiles])
    },
    [files]
  )
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
    setShowAddItemButton(true)
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
          const updatedRow = { ...row, [field]: value }

          if (field === 'itemDetail') {
            const selectedItem = itemDetails.find(
              (item: any) => item.name === value
            )

            if (selectedItem) {
              updatedRow.purchase_price = parseFloat(selectedItem.cost_price)
              updatedRow.sale_price = parseFloat(selectedItem.sale_price)
            }
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
    const selectedItem = itemDetails.find((item) => item.name === itemName)
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

    try {
      const response = await fetch('http://localhost:8000/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'insomnia/8.6.1',
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
      }
      setSuccessAlert(true)
      setTimeout(() => {
        setFormData(initialFormData)
        setSuccessAlert(false)
      }, 1500)
    } catch (error) {
      console.error('Error making purchase:', error)
    }
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

  const saveAsDraft = () => {
    const draftWithVendor = { ...formData, vendorName: formData.vendorName }
    setDrafts([...drafts, draftWithVendor])
    setFormData(initialFormData)
  }

  const renderFileNames = () => (
    <List>
      {files.map((file, index) => (
        <ListItem key={index}>
          <ListItemIcon>
            <InsertDriveFileIcon />
          </ListItemIcon>
          <ListItemText
            primary={file.name}
            secondary={`Size: ${file.size} bytes`}
          />
        </ListItem>
      ))}
    </List>
  )
  return (
    <Box sx={{ margin: 2 }}>
      {successAlert && (
        <div
          style={{
            backgroundColor: '#4caf50',
            color: '#ffffff',
            padding: '1rem',
            marginBottom: '1rem',
          }}
        >
          Purchase order successful!
        </div>
      )}
      <div className="heading">
        <Typography variant="h4" component="h1">
          Make a purchase
        </Typography>
        <IconButton onClick={() => setOpenDraftsModal(true)}>
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
        {!showAddItemButton && (
          <Grid item xs={12}>
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
        )}
      </Grid>

      {formData.itemRows.length > 0 && (
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
                      <MenuItem key={index} value={itemName}>
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
                      handleItemChange(row.id, 'purchase_price', e.target.value)
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
      )}
      {showAddItemButton && (
        <Grid item xs={12}>
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
      )}
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
            {(totalAmount - formData.discountValue).toFixed(2)}
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
        onClose={handleDraftsModalClose}
        drafts={drafts}
        deleteDraft={deleteDraft}
      />
    </Box>
  )
}

export default PurchaseScreen
