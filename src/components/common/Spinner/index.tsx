import CircularProgress from '@mui/material/CircularProgress'
import './Spinner.scss'

export interface ISpinnerProps {
  label?: string
}

const Spinner: React.FC<ISpinnerProps> = ({ label }) => (
  <div className="spinner-wrapper">
    <CircularProgress color="inherit" />
    {label && (
      <div className="wk-margins">
        <p className="wk-size-4">{label}</p>
      </div>
    )}
  </div>
)

export default Spinner
