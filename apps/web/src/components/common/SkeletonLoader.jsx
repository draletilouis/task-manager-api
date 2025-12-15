const SkeletonLoader = ({ className = '', width = '100%', height = '16px' }) => {
  return (
    <div
      className={className}
      style={{
        width,
        height,
        background: '#e0e0e0',
        borderRadius: '4px',
        animation: 'pulse 1.5s ease-in-out infinite'
      }}
    >
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '15px'
    }}>
      <SkeletonLoader height="24px" width="75%" style={{ marginBottom: '12px' }} />
      <SkeletonLoader height="16px" width="100%" style={{ marginBottom: '8px' }} />
      <SkeletonLoader height="16px" width="85%" style={{ marginBottom: '15px' }} />
      <div style={{ display: 'flex', gap: '10px' }}>
        <SkeletonLoader height="40px" width="100px" />
        <SkeletonLoader height="40px" width="100px" />
      </div>
    </div>
  );
};

export const SkeletonTaskCard = () => {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #ddd',
      borderRadius: '4px',
      padding: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
        <SkeletonLoader height="12px" width="12px" style={{ borderRadius: '50%', marginTop: '4px' }} />
        <SkeletonLoader height="20px" width="100%" />
      </div>
      <SkeletonLoader height="16px" width="80%" style={{ marginBottom: '8px' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
        <SkeletonLoader height="24px" width="64px" style={{ borderRadius: '12px' }} />
        <SkeletonLoader height="24px" width="24px" style={{ borderRadius: '50%' }} />
      </div>
    </div>
  );
};

export default SkeletonLoader;
