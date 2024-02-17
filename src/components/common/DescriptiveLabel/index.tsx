import { styled } from '@mui/material/styles'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import React from 'react'

import './DescriptiveLabel.scss'

const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: 'rgba(0, 0, 0, 0.87)',
    boxShadow: theme.shadows[1],
    fontSize: 11,
    maxWidth: 300,
  },
}))

interface ICustomSlider {
  title: string
  description?: string
  action?: React.ReactNode
}

const DescriptiveLabel: React.FC<ICustomSlider> = ({
  title,
  description,
  action,
}) => {
  return (
    <div className="label-wrapper">
      <div className="title">
        <h6>{title}</h6>
        {description && (
          <LightTooltip title={description} arrow>
            <IconButton size="small">
              <InfoOutlinedIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          </LightTooltip>
        )}
      </div>
      {action && <div className="label-action">{action}</div>}
    </div>
  )
}

export default DescriptiveLabel
