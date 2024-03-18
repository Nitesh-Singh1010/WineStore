import React from 'react'
import CommonTable, { Column } from '../common/CommonTable/CommonTable'
import { Button } from '@mui/material'
import lang from '../../lang-en.json'
import './index.scss'

enum Status {
  Active = 'Active',
  Inactive = 'Inactive',
}

interface InventoryItem {
  itemName: string
  costPrice: number
  sellingPrice: number
  quantity: string
  status: Status
}
function createData(
  itemName: string,
  costPrice: number,
  sellingPrice: number,
  quantityValue: number,
  quantityUnit: string,
  status: Status
): InventoryItem {
  return {
    itemName,
    costPrice,
    sellingPrice,
    quantity: `${quantityValue} ${quantityUnit}`,
    status,
  }
}

const Inventory: React.FC = () => {
  const [rows, setRows] = React.useState<InventoryItem[]>([
    createData('Red Label', 320, 390, 750, 'ml', Status.Active),
    createData('Old Monk', 150, 180, 750, 'ml', Status.Active),
    createData('Double Black Label', 279, 300, 180, 'ml', Status.Inactive),
    createData('Sula', 540, 560, 500, 'ml', Status.Inactive),
    createData('Magic Moments', 900, 950, 750, 'ml', Status.Active),
    createData('Blenders Pride', 700, 950, 360, 'ml', Status.Active),
    createData('Absolute Vodka', 900, 1100, 1, 'L', Status.Active),
    createData('Bacardi Black', 660, 750, 1, 'L', Status.Inactive),
  ])

  const columns: Column[] = [
    { id: 'itemName', label: 'Item Name', sortable: true },
    { id: 'costPrice', label: 'Cost Price(Rs.)', sortable: true },
    { id: 'sellingPrice', label: 'Selling Price(Rs.)', sortable: true },
    { id: 'quantity', label: 'Quantity', sortable: false },
    { id: 'status', label: 'Status', sortable: false },
  ]

  return (
    <>
      <div className="heading">
        <h1>{lang['feature.headings'][3]}</h1>
      </div>
      <CommonTable rows={rows} columns={columns} />
    </>
  )
}

export default Inventory
