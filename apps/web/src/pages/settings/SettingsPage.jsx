import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContextDefinition';
import { useToast } from '../../context/ToastContext';
import apiClient from '../../api/client';
import { validatePassword } from '../../utils/validation';

const SettingsPage = () => {
  const { user } = useContext(AuthContext);
  const toast = useToast();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    const passwordValidation = validatePassword(passwordData.newPassword);
    if (!passwordValidation.valid) {
      newErrors.newPassword = passwordValidation.message;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await apiClient.post('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setErrors({});
    } catch (error) {
      toast.error(error.response?.data?.error || error.message || 'Failed to change password');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f5f5f5' }}>
      <div className="container" style={{ paddingTop: '30px', paddingBottom: '30px' }}>
        {/* Header */}
        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>Settings</h1>
          <p style={{ color: '#666' }}>Manage your account settings and preferences</p>
        </div>

        {/* Account Information */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Account Information</h2>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e0e0e0' }}>
              <span style={{ color: '#666', fontWeight: '500' }}>Name</span>
              <span>{user?.name || 'N/A'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e0e0e0' }}>
              <span style={{ color: '#666', fontWeight: '500' }}>Email</span>
              <span>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
              <span style={{ color: '#666', fontWeight: '500' }}>User ID</span>
              <span style={{ color: '#666', fontSize: '14px', fontFamily: 'monospace' }}>{user?.id}</span>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="card">
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Change Password</h2>
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Current Password */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
                Current Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  style={{
                    width: '100%',
                    paddingRight: '40px',
                    borderColor: errors.currentPassword ? '#d32f2f' : '#ddd'
                  }}
                  placeholder="Enter current password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                >
                  {showCurrentPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="error" style={{ marginTop: '5px' }}>{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
                New Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  style={{
                    width: '100%',
                    paddingRight: '40px',
                    borderColor: errors.newPassword ? '#d32f2f' : '#ddd'
                  }}
                  placeholder="Enter new password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                >
                  {showNewPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.newPassword && (
                <p className="error" style={{ marginTop: '5px' }}>{errors.newPassword}</p>
              )}
              <p style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                Password must be at least 8 characters long
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
                Confirm New Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  style={{
                    width: '100%',
                    paddingRight: '40px',
                    borderColor: errors.confirmPassword ? '#d32f2f' : '#ddd'
                  }}
                  placeholder="Confirm new password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#666',
                    cursor: 'pointer',
                    padding: '5px'
                  }}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="error" style={{ marginTop: '5px' }}>{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <div style={{ paddingTop: '15px' }}>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  background: isSubmitting ? '#999' : '#0066cc',
                  color: '#fff',
                  padding: '10px',
                  borderRadius: '4px',
                  fontWeight: '500',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                  border: 'none'
                }}
              >
                {isSubmitting ? 'Changing Password...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
