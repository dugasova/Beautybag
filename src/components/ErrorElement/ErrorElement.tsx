import './ErrorElement.css';
import { Link } from 'react-router-dom';

export default function ErrorElement() {
  return (
    <div className='error-page'>
      <div className='error-container'>
        <h1 className='error-title'>404</h1>
        <h2 className='error-subtitle'>Oops! Page not found</h2>
        <p className='error-text'>
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Link to="/" className='error-home-btn'>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
