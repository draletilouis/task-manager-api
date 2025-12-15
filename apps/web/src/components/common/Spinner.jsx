const Spinner = ({
  size = 'md',
  fullScreen = true,
  message = ''
}) => {
  const getSize = () => {
    switch (size) {
      case 'sm': return '20px';
      case 'md': return '32px';
      case 'lg': return '48px';
      default: return '32px';
    }
  };

  const spinnerElement = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
      <div style={{
        width: getSize(),
        height: getSize(),
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #0066cc',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      {message && (
        <p style={{ fontSize: '14px', color: '#666', fontWeight: '500' }}>{message}</p>
      )}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );

  if (fullScreen) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f5f5f5'
      }}>
        {spinnerElement}
      </div>
    );
  }

  return spinnerElement;
};

export default Spinner;
