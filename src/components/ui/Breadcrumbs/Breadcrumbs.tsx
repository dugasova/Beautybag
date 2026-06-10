import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Breadcrumbs.css';
import { MdChevronRight, MdHome } from 'react-icons/md';

export default function Breadcrumbs() {
  const location = useLocation();
  const { t } = useTranslation();

  const pathnames = location.pathname.split('/').filter((x) => x);

  // Don't show breadcrumbs on the home page
  if (pathnames.length === 0) return null;

  return (
    <nav className="breadcrumbs container">
      <ul className="breadcrumbs-list">
        <li className="breadcrumbs-item">
          <Link to="/" className="breadcrumbs-link home-icon">
            <MdHome size={20} />
          </Link>
        </li>

        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          // Decode URL value for display (e.g. %20 to space)
          const displayName = decodeURIComponent(value);

          return (
            <li key={to} className="breadcrumbs-item">
              <MdChevronRight className="separator" />
              {last ? (
                <span className="breadcrumbs-current">
                  {t(`navigation.${displayName.toLowerCase()}`, displayName)}
                </span>
              ) : (
                <Link to={to} className="breadcrumbs-link">
                  {t(`navigation.${displayName.toLowerCase()}`, displayName)}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};


