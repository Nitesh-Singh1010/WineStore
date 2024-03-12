import React, { useState } from 'react'
import {
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material'


import ManualAdditionComponent from './ManualAdditionComponent'
import BulkUploadComponent from './BulkUploadComponent'

const ItemsScreen: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>('manual')

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value)
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography variant="h4" style={{ margin: '20px 0' }}>
        ITEMS
      </Typography>
      <FormControl component="fieldset">
        <RadioGroup
          row
          aria-label="addition-type"
          name="row-radio-buttons-group"
          value={selectedValue}
          onChange={handleChange}
        >
          <FormControlLabel
            value="manual"
            control={<Radio />}
            label="Manual Addition"
          />
          <FormControlLabel
            value="bulk"
            control={<Radio />}
            label="Bulk Upload"
          />
        </RadioGroup>
      </FormControl>
      {selectedValue === 'manual' ? (
        <ManualAdditionComponent />
      ) : (
        <BulkUploadComponent />
      )}
    </div>
  )
}

export default ItemsScreen
