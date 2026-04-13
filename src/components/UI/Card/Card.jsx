import './Card.css';

const Card = ({ children, variant = 'white', padded = true, className = '', ...props }) => {
  return (
    <div 
      className={`card card-${variant} ${padded ? 'card-padded' : ''} ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
