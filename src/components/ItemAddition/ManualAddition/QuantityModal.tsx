import React from 'react'
import {
  Modal,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
} from '@mui/material'
import './QuantityModal.scss'

interface AddQuantityModalProps {
  open: boolean
  handleClose: () => void
  newQuantity: string
  setNewQuantity: React.Dispatch<React.SetStateAction<string>>
  newUnit: string
  setNewUnit: React.Dispatch<React.SetStateAction<string>>
  error: string | null
  handleModalSubmit: () => void
}

const QuantityModal: React.FC<AddQuantityModalProps> = ({
  open,
  handleClose,
  newQuantity,
  setNewQuantity,
  newUnit,
  setNewUnit,
  error,
  handleModalSubmit,
}) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <div className="modal-container">
        <Typography variant="h6" gutterBottom>
          Add Quantity
        </Typography>
        <TextField
          label="Enter Quantity"
          placeholder="Enter Quantity"
          fullWidth
          value={newQuantity}
          onChange={(e) => {
            const value = e.target.value
            if (value === '' || /^\d+$/.test(value)) {
              setNewQuantity(value)
            }
          }}
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          required
          className="text-field"
        />
        <Select
          value={newUnit}
          onChange={(e) => setNewUnit(e.target.value as string)}
          displayEmpty
          fullWidth
          required
          className="select"
        >
          <MenuItem value="" disabled>
            Select Unit
          </MenuItem>
          <MenuItem value="L">L</MenuItem>
          <MenuItem value="ml">ml</MenuItem>
          <MenuItem value="Kg">Kg</MenuItem>
          <MenuItem value="g">g</MenuItem>
        </Select>
        {error && (
          <Typography variant="caption" color="error">
            {error}
          </Typography>
        )}
        <Button
          onClick={handleModalSubmit}
          variant="contained"
          color="primary"
          className="save-button"
        >
          Save Quantity
        </Button>
      </div>
    </Modal>
  )
}

export default QuantityModal
