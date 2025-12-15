import { getPasswordStrength } from '../../utils/validation';

const PasswordStrengthMeter = ({ password }) => {
  const { strength, label } = getPasswordStrength(password);

  if (!password) return null;

  const getColor = () => {
    if (strength <= 1) return '#d32f2f';
    if (strength === 2) return '#f57c00';
    if (strength === 3) return '#fbc02d';
    return '#388e3c';
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
        <div style={{
          flex: 1,
          height: '8px',
          background: '#e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div
            style={{
              height: '100%',
              background: getColor(),
              width: `${(strength / 4) * 100}%`,
              transition: 'width 0.3s'
            }}
          />
        </div>
        <span style={{ fontSize: '12px', fontWeight: '500', color: '#666', minWidth: '60px' }}>
          {label}
        </span>
      </div>
      <div style={{ fontSize: '12px', color: '#666' }}>
        {password.length < 8 && <p style={{ margin: '2px 0' }}>• At least 8 characters</p>}
        {!/[a-z]/.test(password) && <p style={{ margin: '2px 0' }}>• One lowercase letter</p>}
        {!/[A-Z]/.test(password) && <p style={{ margin: '2px 0' }}>• One uppercase letter</p>}
        {!/[0-9]/.test(password) && <p style={{ margin: '2px 0' }}>• One number</p>}
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;
