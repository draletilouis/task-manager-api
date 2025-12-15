const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  icon,
  fullWidth = false,
  ...props
}) => {
  const isDisabled = disabled || loading;

  // Simple inline styles based on variant
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return { background: '#0066cc', color: '#fff' };
      case 'secondary':
        return { background: '#f0f0f0', color: '#333', border: '1px solid #ddd' };
      case 'danger':
        return { background: '#d32f2f', color: '#fff' };
      case 'ghost':
        return { background: 'transparent', color: '#333', border: 'none' };
      case 'outline':
        return { background: 'transparent', color: '#0066cc', border: '2px solid #0066cc' };
      default:
        return { background: '#0066cc', color: '#fff' };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '13px' };
      case 'md':
        return { padding: '8px 16px', fontSize: '14px' };
      case 'lg':
        return { padding: '12px 24px', fontSize: '16px' };
      default:
        return { padding: '8px 16px', fontSize: '14px' };
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={className}
      style={{
        ...getVariantStyle(),
        ...getSizeStyle(),
        width: fullWidth ? '100%' : 'auto',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
        opacity: isDisabled ? 0.6 : 1,
        borderRadius: '4px',
        fontWeight: '500',
        ...props.style
      }}
      {...props}
    >
      {loading && <span style={{ marginRight: '5px' }}>...</span>}
      {!loading && icon && <span style={{ marginRight: '5px' }}>{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
