import React, { useContext } from 'react'
import {
  Modal,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
} from '@mui/material'
import './QuantityModal.scss'
import { AppLangContext, AppStateContext, IAppStateContext } from '@Contexts'

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
  const { appLang } = useContext(AppLangContext)
  const { appConfig } = useContext<IAppStateContext>(AppStateContext)

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="modal-container">
        <Typography variant="h6" gutterBottom>
          {appLang['feature.common.quantityModal.heading']}
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
          type="text"
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
            {appLang['feature.common.quantityModal.inputLabel']}
          </MenuItem>
          <MenuItem value="L">
            {appConfig['feature.quantityModal.units'][0]}
          </MenuItem>
          <MenuItem value="ml">
            {appConfig['feature.quantityModal.units'][1]}
          </MenuItem>
          <MenuItem value="Kg">
            {appConfig['feature.quantityModal.units'][2]}
          </MenuItem>
          <MenuItem value="g">
            {appConfig['feature.quantityModal.units'][3]}
          </MenuItem>
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
          {appLang['feature.common.quantityModal.saveQuantity.button']}
        </Button>
      </div>
    </Modal>
  )
}

export default QuantityModal
