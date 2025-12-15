const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
          {label}
          {required && <span style={{ color: '#d32f2f', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={className}
        style={{
          width: '100%',
          padding: '8px',
          border: error ? '1px solid #d32f2f' : '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px',
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'text'
        }}
        {...props}
      />
      {error && (
        <p className="error" style={{ marginTop: '5px' }}>{error}</p>
      )}
    </div>
  );
};

export default Input;
