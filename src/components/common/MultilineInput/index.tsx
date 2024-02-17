import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import IconButton from '@mui/material/IconButton'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import React, { useMemo } from 'react'
import './MultilineInput.scss'

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

interface IMultilineInput {
  autoComplete?: 'off' | 'on'
  canResize?: boolean
  className?: string
  disabled?: boolean
  fullWidth?: boolean
  headerAction?: React.ReactNode
  hasBackground?: boolean
  label?: string
  labelDescription?: string
  maxRows?: number
  minRows?: number
  name?: string
  placeholder?: string
  rows?: number
  value?: string
  variant?: 'standard' | 'filled' | 'outlined'
  onValueChange?: (newValue: string) => void
  onValueBlur?: (newValue: string) => void
  onKeyDown?: (
    event: React.KeyboardEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLDivElement
    >
  ) => void
  onKeyUp?: (
    event: React.KeyboardEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLDivElement
    >
  ) => void
}

const MultilineInput: React.FC<IMultilineInput> = ({
  autoComplete,
  canResize,
  className,
  disabled,
  fullWidth,
  hasBackground,
  headerAction,
  label,
  labelDescription,
  maxRows,
  minRows,
  name,
  placeholder,
  rows,
  value,
  variant,
  onValueChange,
  onValueBlur,
  onKeyDown,
  onKeyUp,
}) => {
  const initialClass = useMemo(
    () => (className ? `${className} ` : ''),
    [className]
  )
  const backgroundClass = useMemo(
    () => (hasBackground ? 'input-with-background ' : ''),
    [hasBackground]
  )
  const resizeClass = useMemo(() => (canResize ? 'resizable' : ''), [canResize])

  return (
    <div className="multiline-input-wrapper">
      {label && (
        <div className="label-row">
          <div className="title">
            <h6>{label}</h6>
            {labelDescription && (
              <LightTooltip title={labelDescription} arrow>
                <IconButton size="small">
                  <InfoOutlinedIcon sx={{ fontSize: '0.8rem' }} />
                </IconButton>
              </LightTooltip>
            )}
          </div>
          {headerAction && <div className="action">{headerAction}</div>}
        </div>
      )}
      <TextField
        autoComplete={autoComplete}
        className={`${initialClass}${backgroundClass}${resizeClass}`}
        disabled={disabled}
        fullWidth={fullWidth}
        placeholder={placeholder}
        rows={rows}
        maxRows={maxRows}
        minRows={minRows}
        multiline
        name={name}
        value={value}
        variant={variant}
        onBlur={(
          event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
        ) => (onValueBlur ? onValueBlur(event.target.value) : '')}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onValueChange ? onValueChange(event.target.value) : ''
        }
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
    </div>
  )
}

export default MultilineInput
