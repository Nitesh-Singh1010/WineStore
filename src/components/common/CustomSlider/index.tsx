import { styled } from '@mui/material/styles'
import Input from '@mui/material/Input'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import Slider from '@mui/material/Slider'
import React from 'react'
import './CustomSlider.scss'

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
  label: string
  labelDescription?: string
  min: number
  max: number
  step?: number
  value: number
  onValueChange: (newValue: number) => void
}

const CustomSlider: React.FC<ICustomSlider> = ({
  label,
  labelDescription,
  min,
  max,
  step,
  value,
  onValueChange,
}) => {
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value === '' ? 0 : Number(event.target.value))
  }
  const handleBlur = () => {
    if (value < min) {
      onValueChange(min)
    } else if (value > max) {
      onValueChange(max)
    }
  }

  return (
    <div className="slider-container">
      <div className="slider-header">
        <div className="title">
          <h6>{label}</h6>
          {labelDescription && (
            <LightTooltip title={labelDescription} arrow>
              <IconButton size="small">
                <InfoOutlinedIcon sx={{ fontSize: '0.75rem' }} />
              </IconButton>
            </LightTooltip>
          )}
        </div>
        <Input
          value={value}
          size="small"
          onChange={handleInputChange}
          onBlur={handleBlur}
          inputProps={{
            step: step,
            min: min,
            max: max,
            type: 'number',
          }}
        />
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={typeof value === 'number' ? value : 0}
        onChange={(_event: Event, newValue: number | number[]) =>
          typeof newValue === 'number' && onValueChange(newValue)
        }
      />
    </div>
  )
}

export default CustomSlider
