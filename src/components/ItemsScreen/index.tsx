import React, { useContext, useState } from 'react'
import {
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@mui/material'

import { AppLangContext } from '@Contexts'
import ManualAdditionComponent from '../ItemAddition/ManualAddition/ManualAdditionComponent'
import BulkUploadComponent from '../ItemAddition/BulkUpload/BulkUploadComponent'

const ItemsScreen: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>('manual')
  const { appLang } = useContext(AppLangContext)
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value)
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography variant="h4" style={{ margin: '20px 0' }}>
        {appLang['feature.itemScreen.heading']}
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
            label={appLang['feature.itemScreen.itemAdditionOptions'][0]}
          />
          <FormControlLabel
            value="bulk"
            control={<Radio />}
            label={appLang['feature.itemScreen.itemAdditionOptions'][1]}
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
