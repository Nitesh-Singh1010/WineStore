import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="custom-centered-message">
      <div>
        <b>404</b>&nbsp;|&nbsp;Not Found
      </div>
      <div className="additional-info">
        Return to <Link to="/">Home</Link>
      </div>
    </div>
  )
}

export default NotFound
