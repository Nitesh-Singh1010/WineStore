import React, { useState, useCallback, useContext, useEffect } from 'react'
import {
  Box,
  Button,
  FormControl,
  Grid,
  Paper,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  ListItemSecondaryAction,
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
import './index.scss'
import ResetConfirmationDialog from '@components/common/ResetConfirmationDialog/ResetConfirmationDialog'
import DraftsDialog from '@components/PurchaseScreen/DraftsDialog'
import FileUpload from './FileUpload'
import { calculateTotalAmount } from '../../utils'
import { AppLangContext } from '@Contexts'

interface Item {
  id: number
  name: string
  costPrice: number
  sellingPrice: number
}

interface ItemRow {
  id: string
  itemDetail: string
  quantity: number
  costPrice: number
  sellingPrice: number
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
  const [drafts, setDrafts] = useState<FormData[]>([]) // State to store drafts
  const [items, setItems] = useState<Item[]>([]) // State to store items fetched from API

  // Fetch all items from API on component mount
  useEffect(() => {
    fetchItems()
  }, [])
  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/items', {
        headers: {
          store: 1,
        },
      })
      const responseData = await response.json()
      console.log(responseData)
      if (responseData.status === 'OK') {
        setItems(responseData.data) // Set the data array to the items state variable
      } else {
        console.error('Error fetching items:', responseData.message)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
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
  const handleItemChange = async (
    id: string,
    field: keyof ItemRow,
    value: string
  ) => {
    // Update item detail
    if (field === 'itemDetail') {
      const selectedItem = items.find((item) => item.name === value)
      if (selectedItem) {
        const itemDetails = await getItemDetails(selectedItem.id)
        setFormData((prevState) => ({
          ...prevState,
          itemRows: prevState.itemRows.map((row) =>
            row.id === id
              ? {
                  ...row,
                  itemDetail: value,
                  costPrice: itemDetails.costPrice,
                  sellingPrice: itemDetails.sellingPrice,
                }
              : row
          ),
        }))
      }
    } else {
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
  }

  // const handleItemChange = async (
  //   id: string,
  //   field: keyof ItemRow,
  //   value: string
  // ) => {
  //   // Update item detail
  //   if (field === 'itemDetail') {
  //     const selectedItem = items.find((item) => item.name === value)
  //     if (selectedItem) {
  //       const itemDetails = await getItemDetails(selectedItem.id)
  //       setFormData((prevState) => ({
  //         ...prevState,
  //         itemRows: prevState.itemRows.map((row) =>
  //           row.id === id
  //             ? {
  //                 ...row,
  //                 itemDetail: value,
  //                 costPrice: itemDetails.costPrice,
  //                 sellingPrice: itemDetails.sellingPrice,
  //               }
  //             : row
  //         ),
  //       }))
  //     }
  //   } else {
  //     setFormData((prevState) => ({
  //       ...prevState,
  //       itemRows: prevState.itemRows.map((row) => {
  //         if (row.id === id) {
  //           const updatedRow = { ...row, [field]: value }

  //           if (['quantity', 'costPrice', 'sellingPrice'].includes(field)) {
  //             const total = updatedRow.quantity * updatedRow.costPrice
  //             return { ...updatedRow, total }
  //           }
  //           return updatedRow
  //         }
  //         return row
  //       }),
  //     }))
  //   }
  // }

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
    setDrafts([...drafts, draftWithVendor]) // Saving current form data as a draft
    // Sending formData to backend for saving draft by writing backend logic
    setFormData(initialFormData) // Resetting the form data to initial state
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

//   const getItemDetails = async (itemId: number) => {
//     try {
//       const response = await fetch(
//         `http://localhost:8000/api/item/get/${itemId}`,
//         {
//           method: 'GET',
//           headers: {
//             store: '1',
//           },
//         }
//       )
//       const data = await response.json()
//       console.log(data)
//       return {
//         costPrice: data.costPrice,
//         sellingPrice: data.sellingPrice,
//       }
//     } catch (error) {
//       console.error('Error fetching item details:', error)
//       return {
//         costPrice: 0,
//         sellingPrice: 0,
//       }
//     }
//   }
  const getItemDetails = async (itemId: number) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/item/get/${itemId}`,
        {
          method: 'GET',
          headers: {
            store: '1',
          },
        }
      )
      const data = await response.json()
      console.log(data)
      return {
        costPrice: data.cost_price,
        sellingPrice: data.sale_price,
      }
    } catch (error) {
      console.error('Error fetching item details:', error)
      return {
        costPrice: 0,
        sellingPrice: 0,
      }
    }
  }
  return (
    <Box sx={{ margin: 2 }}>
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
                    value={row.itemDetail}
                    onChange={(e) =>
                      handleItemChange(row.id, 'itemDetail', e.target.value)
                    }
                  >
                    <MenuItem value="">Select an item</MenuItem>{' '}
                    {Array.isArray(items) &&
                      items.map((item) => (
                        <MenuItem key={item.id} value={item.name}>
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
                  />
                </TableCell>
                <TableCell>
                  {/* <TextField
                    fullWidth
                    type="number"
                    value={row.costPrice}
                    onChange={(e) =>
                      handleItemChange(row.id, 'costPrice', e.target.value)
                    }
                    
                  /> */}
                  <TextField
                    fullWidth
                    type="number"
                    value={row.costPrice || ''} // Ensure the value is always defined or set to an empty string
                    onChange={(e) =>
                      handleItemChange(row.id, 'costPrice', e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    type="number"
                    value={row.sellingPrice || ''} // Ensure the value is always defined or set to an empty string
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
                label={`Discount (${
                  formData.discountType === 'percentage' ? '%' : 'Rs.'
                })`}
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
            {appLang['features.purchaseScreenMessages.totalAmountLabel']}{' '}
            {(totalAmount - formData.discountValue).toFixed(2)}
          </Typography>
        </Grid>

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
