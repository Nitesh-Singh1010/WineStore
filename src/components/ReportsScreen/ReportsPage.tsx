import React, { useState } from 'react'
import { Typography, Select, MenuItem, Box } from '@mui/material'
import Transactions from './Transactions'
import Receivables from './Receivables'
import Deposits from './Deposits'

enum ReportType {
  Transactions = 'Transactions',
  Receivables = 'Receivables',
  Deposits = 'Deposits',
}

const ReportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<ReportType | ''>('')

  const handleReportChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedReport(event.target.value as ReportType)
  }

  const renderReportComponent = () => {
    switch (selectedReport) {
      case ReportType.Transactions:
        return <Transactions />
      case ReportType.Receivables:
        return <Receivables />
      case ReportType.Deposits:
        return <Deposits />
      default:
        return null
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" m={4}>
      <Typography variant="h3" gutterBottom>
        Reports
      </Typography>
      <Box mt={2} mb={2}>
        <Select
          value={selectedReport}
          onChange={handleReportChange}
          variant="outlined"
          style={{ width: 200 }}
          displayEmpty 
        >
          <MenuItem value="" disabled>
            Select Report
          </MenuItem>
          <MenuItem value={ReportType.Transactions}>Transactions</MenuItem>
          <MenuItem value={ReportType.Receivables}>Receivables</MenuItem>
          <MenuItem value={ReportType.Deposits}>Deposits</MenuItem>
        </Select>
      </Box>
      {renderReportComponent()}
    </Box>
  )
}

export default ReportsPage
