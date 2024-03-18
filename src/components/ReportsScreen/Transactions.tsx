import React from 'react'
import CommonTable, { Column } from '../common/CommonTable/CommonTable'
import { Button } from '@mui/material'
import lang from '../../lang-en.json'
enum PaymentMode {
  UPI = 'UPI',
  Cash = 'Cash',
  Card = 'Card',
}

function createData(
  itemName: string,
  quantity: number,
  totalAmount: number,
  costPrice: number,
  discount: number,
  sellingPrice: number,
  transactionDate: Date,
  paymentMode: PaymentMode
) {
  return {
    itemName,
    quantity,
    totalAmount,
    costPrice,
    discount,
    sellingPrice,
    transactionDate,
    paymentMode,
  };
}

const Transactions: React.FC = () => {
  const rows = [
    createData('Red Label', 12, 3200, 2000, 50, 1150, new Date('2024-03-13') , PaymentMode.Cash),
    createData('Absolute Vodka', 10, 2000, 1000, 200, 800, new Date('2024-03-12'), PaymentMode.Card),
    createData('Bombay Sapphire', 19, 1700, 1300, 50, 350, new Date('2024-03-11'), PaymentMode.UPI),
    createData('Old Monk Gold Reserve 12 Yrs', 7, 2100, 700, 0, 1400, new Date('2024-03-10'), PaymentMode.UPI),
    createData('Sula', 6, 4500, 2500, 100, 1900,new Date('2024-03-01'), PaymentMode.Cash),
    createData('Tuborg Classic', 2, 2700, 1100, 300, 1300, new Date('2024-02-25'), PaymentMode.Cash),
    createData('Ballentine', 2, 900, 200, 50, 650, new Date('2024-02-28'), PaymentMode.Card),
    createData('Black Bacardi', 8, 3800, 1200, 90, 2510, new Date('2024-02-24'), PaymentMode.Card),
  ];
 
  const columns: Column[] = [
    { id: 'itemName', label: 'Item Name', sortable: true },
    { id: 'quantity', label: 'Quantity', sortable: true },
    { id: 'totalAmount', label: 'Total Amount(Rs.)', sortable: true },
    { id: 'discount', label: 'Discount(Rs.)', sortable: true },
    { id: 'sellingPrice', label: 'Selling Price(Rs.)', sortable: true },
    { id: 'transactionDate', label: 'Date', sortable: false,dataType: 'date' },
    { id: 'paymentMode', label: 'Payment Mode', sortable: false },
  ]

  return (
    <>
      <div className="heading">
        <h1>{lang['feature.report.headings'][0]}</h1>
      </div>
      <CommonTable rows={rows} columns={columns} />
    </>
  )
}

export default Transactions
