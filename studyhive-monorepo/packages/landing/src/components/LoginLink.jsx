import React from 'react';
import { Link } from 'react-router-dom';
import { routes } from '@shared/routes';

function LoginLink() {
  return (
    <Link to={routes.public.login} className="login-link">
      Already a member?
    </Link>
  );
}

export default LoginLink; 