import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routes } from '../../routes';

function Header() {
  const location = useLocation();
  const isPublicRoute = Object.values(routes.public).includes(location.pathname);

  return isPublicRoute ? null : (
    <header className="header">
      <nav>
        {Object.entries(routes.protected).map(([key, path]) => (
          <Link key={key} to={path}>
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </Link>
        ))}
      </nav>
    </header>
  );
}

export default Header; 