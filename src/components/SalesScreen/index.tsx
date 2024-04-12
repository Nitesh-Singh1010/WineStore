import React, { useContext, useState } from 'react'
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
import { AppLangContext } from '@Contexts'
import { AppStateContext, IAppStateContext } from '@Contexts'
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

    setIdCounter((prevCounter) => prevCounter - 1)
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
    // let discountedTotal = totalAmount
    // if (formData.discountType === 'percentage') {
    //   discountedTotal -= (totalAmount * formData.discountValue) / 100
    // } else if (formData.discountType === 'absolute') {
    //   discountedTotal -= formData.discountValue
    // }
    //api call to send data to backend
    setFormData(initialFormData)
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
                    >
                      <MenuItem value="Item 1">
                        {appConfig['feature.itemDetails'][0]}
                      </MenuItem>
                      <MenuItem value="Item 2">
                        {appConfig['feature.itemDetails'][1]}
                      </MenuItem>
                      <MenuItem value="Item 3">
                        {appConfig['feature.itemDetails'][2]}
                      </MenuItem>
                      <MenuItem value="Item 4">
                        {appConfig['feature.itemDetails'][3]}
                      </MenuItem>
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
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" my={5} className="totalAmount">
            {appLang['feature.salesScreen.totalAmountLabel']}{' '}
            {(totalAmount - formData.discountValue).toFixed(2)}
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
