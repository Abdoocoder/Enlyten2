import { Link } from 'react-router-dom';
import './Button.css';

const Button = ({ children, variant = 'primary', to, className = '', ...props }) => {
  const classes = `btn btn-${variant} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;
