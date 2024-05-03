import CommonTable, { Column } from '../common/CommonTable/CommonTable'
import { AppLangContext } from '@Contexts'
import React, { useEffect, useState, useContext } from 'react'

enum PaymentMode {
  UPI = 'UPI',
  Cash = 'Cash',
  Card = 'Card',
}

interface Transaction {
  itemName: string
  quantity: number
  totalAmount: number
  costPrice: number
  discount: number
  sellingPrice: number
  transactionDate: Date
  paymentMode: PaymentMode
}

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const { appLang } = useContext(AppLangContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/transactions', {
          headers: {
            store: '1',
          },
        })
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        console.log(data)
        const formattedTransactions: Transaction[] = data.data.flatMap(
          (transaction: any) => {
            const formattedTransactionItems = transaction.transaction_items.map(
              (item: any) => {
                const discount =
                  transaction.discount.discount_type === 'absolute'
                    ? transaction.discount.amount
                    : (transaction.discount.amount / 100) * item.total_amount
                return {
                  itemName: item.item.identifier,
                  quantity: item.quantity,
                  totalAmount: item.total_amount,
                  costPrice: parseFloat(item.item.cost_price),
                  discount,
                  sellingPrice: parseFloat(item.item.sale_price),
                  transactionDate: new Date(
                    transaction.created_at.split('T')[0]
                  ),
                  paymentMode: transaction.payment_method as PaymentMode,
                }
              }
            )
            return formattedTransactionItems
          }
        )
        setTransactions(formattedTransactions)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const columns: Column[] = [
    { id: 'itemName', label: 'Item Name', sortable: true },
    { id: 'quantity', label: 'Quantity', sortable: true },
    { id: 'totalAmount', label: 'Total Amount(Rs.)', sortable: true },
    { id: 'discount', label: 'Discount(Rs.)', sortable: true },
    { id: 'sellingPrice', label: 'Selling Price(Rs.)', sortable: true },
    { id: 'transactionDate', label: 'Date', sortable: false, dataType: 'date' },
    { id: 'paymentMode', label: 'Payment Mode', sortable: false },
  ]

  return (
    <>
      <div className="heading">
        <h1>{appLang['feature.transaction.heading']}</h1>
      </div>
      <CommonTable rows={transactions} columns={columns} />
    </>
  )
}

export default Transactions
