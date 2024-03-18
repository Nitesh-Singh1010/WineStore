import React from 'react'
import CommonTable, { Column } from '../common/CommonTable/CommonTable'
import { Button } from '@mui/material'
import lang from '../../lang-en.json'
function createData(
  customerName: string,
  totalAmount: number,
  receivedAmount: number,
  discount: number,
  remainingAmount: number
) {
  return {
    customerName,
    totalAmount,
    receivedAmount,
    discount,
    remainingAmount,
  }
}

const Receivables: React.FC = () => {
  const rows = [
    createData('Ashwin', 3200, 2000, 50, 1150),
    createData('Siraj', 2000, 1000, 200, 800),
    createData('Raina', 1700, 1300, 50, 350),
    createData('Rahul', 2100, 700, 0, 1400),
    createData('Rohit', 4500, 2500, 100, 1900),
    createData('Kohli', 2700, 1100, 300, 1300),
    createData('Dhoni', 900, 200, 50, 650),
    createData('Yuvraj', 3800, 1200, 90, 2510),
  ]

  const columns: Column[] = [
    { id: 'customerName', label: 'Customer Name', sortable: true },
    { id: 'totalAmount', label: 'Total Amount(Rs.)', sortable: true },
    { id: 'receivedAmount', label: 'Received Amount(Rs.)', sortable: true },
    { id: 'discount', label: 'Discount(Rs.)', sortable: true },
    { id: 'remainingAmount', label: 'Remaining Amount(Rs.)', sortable: true },
  ]

  return (
    <>
      <div className="heading">
        <h1>{lang['feature.report.headings'][1]}</h1>
      </div>
      <CommonTable rows={rows} columns={columns} />
    </>
  )
}

export default Receivables
