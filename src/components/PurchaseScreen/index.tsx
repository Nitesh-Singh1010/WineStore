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
  Paper,
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
import { useDropzone } from 'react-dropzone'
import React, { useState, useCallback } from 'react'
import { SelectChangeEvent } from '@mui/material/Select'
import FileUpload from './FileUpload'
import './index.scss'
import { calculateTotalAmount } from '../../utils'
import langEN from '../../lang-en.json'
interface ItemRow {
  id: string
  itemDetail: string
  quantity: number
  costPrice: number
  sellingPrice: number
  total: number
}

interface FormData {
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

  const [showAddItemButton, setShowAddItemButton] = useState(false)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [files, setFiles] = useState<File[]>([])
  const [openResetConfirmation, setOpenResetConfirmation] = useState(false)
  const [drafts, setDrafts] = useState<FormData[]>([]) // State to store drafts

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles([...files, ...acceptedFiles])
    },
    [files]
  )
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.gif', '.bmp'],
      'application/pdf': ['.pdf'],
    },
  })

  const addItemRow = () => {
    setFormData((prevState) => ({
      ...prevState,
      itemRows: [
        ...prevState.itemRows,
        {
          id: uuidv4(),
          itemDetail: '',
          quantity: 0,
          costPrice: 0,
          sellingPrice: 0,
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

          if (['quantity', 'costPrice', 'sellingPrice'].includes(field)) {
            const total = updatedRow.quantity * updatedRow.costPrice
            return { ...updatedRow, total }
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
    const discountType: string = event.target.value as string // Ensure discountType is of type string
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
    setDrafts([...drafts, formData]) // Saving current form data as a draft
    // Sending formData to backend for saving draft by writing backend logic
  }

  const renderDrafts = () => (
    <Dialog open={true} onClose={() => {}}>
      <DialogTitle>
        {langEN['features.common.purchaseMessages'].draftDialogTitle}
      </DialogTitle>
      <DialogContent>
        <List>
          {drafts.map((draft, index) => (
            <ListItem key={index}>
              <ListItemText primary={draft.vendorName} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )

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
      <div className="heading">
        <Typography variant="h4" component="h1">
          Make a purchase
        </Typography>
        <IconButton onClick={renderDrafts}>
          <ArrowDropDownIcon />
          <Typography>View Drafts</Typography>
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
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            type="date"
            label="Purchase Date"
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
                {langEN['features.common.purchaseMessages'].itemDetail}
              </TableCell>
              <TableCell>
                {langEN['features.common.purchaseMessages'].quantity}
              </TableCell>
              <TableCell>
                {langEN['features.common.purchaseMessages'].purchasePrice}
              </TableCell>
              <TableCell>
                {langEN['features.common.purchaseMessages'].sellingPrice}
              </TableCell>
              <TableCell>
                {langEN['features.common.purchaseMessages'].total}
              </TableCell>
              <TableCell>
                {langEN['features.common.purchaseMessages'].action}
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
                    value={row.costPrice}
                    onChange={(e) =>
                      handleItemChange(row.id, 'costPrice', e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    type="number"
                    value={row.sellingPrice}
                    onChange={(e) =>
                      handleItemChange(row.id, 'sellingPrice', e.target.value)
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
            <InputLabel id="payment-mode-label">{langEN['features.common.purchaseMessages'].paymentMode}</InputLabel>
            <Select
              labelId="payment-mode-label"
              value={formData.paymentMode}
              label="Payment Mode"
              onChange={(e) =>
                setFormData({ ...formData, paymentMode: e.target.value })
              }
            >
              <MenuItem value="Cash">{langEN['features.common.purchaseMessages'].cash}</MenuItem>
              <MenuItem value="Card">{langEN['features.common.purchaseMessages'].card}</MenuItem>
              <MenuItem value="UPI">{langEN['features.common.purchaseMessages'].upi}</MenuItem>
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
        <Grid item xs={12} md={10}>
          <Typography variant="h6" className="totalAmountText">
            {langEN['features.common.purchaseMessages'].totalAmountLabel}{' '}
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
      <Dialog
        open={openResetConfirmation}
        onClose={() => setOpenResetConfirmation(false)}
      >
        <DialogTitle>
          {langEN['features.common.purchaseMessages'].confirmation}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {
              langEN['features.common.purchaseMessages']
                .resetPurchaseConfirmation
            }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenResetConfirmation(false)
              setFormData(initialFormData)
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
    </Box>
  )
}

export default PurchaseScreen
