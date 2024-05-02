import React, { useEffect, useState, useContext } from 'react'
import CommonTable, { Column } from '../common/CommonTable/CommonTable'
import { AppLangContext } from '@Contexts'
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

const Inventory: React.FC = () => {
  const [rows, setRows] = useState<InventoryItem[]>([])
  const { appLang } = useContext(AppLangContext)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/items', {
          headers: {
            store: '1',
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        const items: InventoryItem[] = data.data.map((item: any) => ({
          itemName: item.identifier,
          costPrice: parseFloat(item.cost_price),
          sellingPrice: parseFloat(item.sale_price),
          quantity: item.quantity.identifier,
          status: item.status as Status,
        }))
        setRows(items)
      } catch (error) {
        // console.error('Error fetching data:', error)
        alert('Failed to fetch data from the server. Please try again later.')
      }
    }

    fetchData()
  }, [])

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
        <h1>{appLang['feature.inventoryScreen.heading']}</h1>
      </div>
      <CommonTable rows={rows} columns={columns} />
    </>
  )
}

export default Inventory
