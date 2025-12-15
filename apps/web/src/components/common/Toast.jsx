import { useToast } from '../../context/ToastContext';

const Toast = () => {
  const { toasts, removeToast } = useToast();

  const getTypeStyle = (type) => {
    switch (type) {
      case 'success':
        return { background: '#388e3c', color: '#fff' };
      case 'error':
        return { background: '#d32f2f', color: '#fff' };
      case 'warning':
        return { background: '#f57c00', color: '#fff' };
      case 'info':
        return { background: '#0066cc', color: '#fff' };
      default:
        return { background: '#333', color: '#fff' };
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            ...getTypeStyle(toast.type),
            padding: '12px 16px',
            borderRadius: '4px',
            minWidth: '300px',
            maxWidth: '500px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          <span style={{ fontSize: '14px', fontWeight: '500' }}>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              marginLeft: '15px',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '18px',
              lineHeight: 1,
              fontWeight: 'bold'
            }}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
