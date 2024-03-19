import React from 'react'
import {
  TableRow,
  TableCell,
  IconButton,
  TextField,
  Tooltip,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import Autocomplete from '@mui/material/Autocomplete'

interface ItemRowProps {
  item: any
  index: number
  quantityOptions: string[]
  handleItemChange: (index: number, field: string, value: any) => void
  handleDeleteItem: (index: number) => void
}

const ItemRow: React.FC<ItemRowProps> = ({
  item,
  index,
  quantityOptions,
  handleItemChange,
  handleDeleteItem,
}) => {
  return (
    <TableRow key={index}>
      <TableCell style={{ width: '50%' }}>
        <TextField
          value={item.itemName}
          onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
          fullWidth
          placeholder="Item Name"
        />
      </TableCell>
      <TableCell style={{ width: '15%' }}>
        <TextField
          type="number"
          value={item.costPrice}
          onChange={(e) =>
            handleItemChange(index, 'costPrice', Number(e.target.value))
          }
          fullWidth
        />
      </TableCell>
      <TableCell style={{ width: '15%' }}>
        <TextField
          type="number"
          value={item.sellingPrice}
          onChange={(e) =>
            handleItemChange(index, 'sellingPrice', Number(e.target.value))
          }
          fullWidth
        />
      </TableCell>
      <TableCell style={{ width: '20%' }}>
        <Autocomplete
          value={item.quantity}
          onChange={(event, value) =>
            handleItemChange(index, 'quantity', value)
          }
          options={quantityOptions}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Quantity"
              fullWidth
              placeholder="Select or enter quantity"
            />
          )}
        />
      </TableCell>
      <TableCell>
        <Tooltip title="Delete">
          <IconButton onClick={() => handleDeleteItem(index)} color="error">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  )
}

export default ItemRow
