import './Input.css';

const Input = ({ label, helperText, ...props }) => {
  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <input className="input-field" {...props} />
      {helperText && <span className="input-helper">{helperText}</span>}
    </div>
  );
};

export default Input;
