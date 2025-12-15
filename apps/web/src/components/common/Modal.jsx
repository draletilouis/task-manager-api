import { useEffect } from 'react';

const Modal = ({
  children,
  onClose,
  title,
  size = 'md',
  showCloseButton = true
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Define size widths
  const getMaxWidth = () => {
    switch (size) {
      case 'sm': return '400px';
      case 'md': return '600px';
      case 'lg': return '800px';
      case 'xl': return '1000px';
      default: return '600px';
    }
  };

  return (
    // Backdrop
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      {/* Modal content box */}
      <div
        style={{
          background: '#fff',
          borderRadius: '8px',
          maxWidth: getMaxWidth(),
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
            borderBottom: '1px solid #ddd'
          }}>
            {title && (
              <h2 style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                style={{
                  padding: '5px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  lineHeight: 1
                }}
                aria-label="Close modal"
              >
                X
              </button>
            )}
          </div>
        )}

        {/* Modal content */}
        <div style={{
          padding: '20px',
          overflowY: 'auto',
          flex: 1
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
