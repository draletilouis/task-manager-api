import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContextDefinition';
import { useWorkspaces } from '../../hooks/useWorkspaces';

const UserProfile = () => {
  const { user } = useContext(AuthContext);
  const { workspaces, loading } = useWorkspaces();
  const [userStats, setUserStats] = useState({
    totalWorkspaces: 0,
    ownedWorkspaces: 0,
    adminWorkspaces: 0,
    memberWorkspaces: 0
  });

  useEffect(() => {
    if (workspaces && user) {
      const stats = {
        totalWorkspaces: workspaces.length,
        ownedWorkspaces: workspaces.filter(w =>
          w.members?.some(m => m.userId === user.id && m.role === 'OWNER')
        ).length,
        adminWorkspaces: workspaces.filter(w =>
          w.members?.some(m => m.userId === user.id && m.role === 'ADMIN')
        ).length,
        memberWorkspaces: workspaces.filter(w =>
          w.members?.some(m => m.userId === user.id && m.role === 'MEMBER')
        ).length
      };
      setUserStats(stats);
    }
  }, [workspaces, user]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#666' }}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#f5f5f5' }}>
      <div className="container" style={{ paddingTop: '30px', paddingBottom: '30px' }}>
        {/* Profile Header */}
        <div className="card" style={{ marginBottom: '20px', overflow: 'hidden' }}>
          <div style={{ background: 'linear-gradient(to right, #0066cc, #8b5cf6)', height: '100px' }}></div>
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '-40px', marginBottom: '15px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#fff',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#0066cc',
                border: '4px solid #fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}>
                {user?.name && getInitials(user.name)}
              </div>
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '5px' }}>{user?.name}</h1>
              <p style={{ color: '#666' }}>{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#666' }}>Total Workspaces</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '5px' }}>
                  {userStats.totalWorkspaces}
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#e3f2fd',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                W
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#666' }}>As Owner</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#8b5cf6', marginTop: '5px' }}>
                  {userStats.ownedWorkspaces}
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#f3e5f5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                O
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#666' }}>As Admin</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#0066cc', marginTop: '5px' }}>
                  {userStats.adminWorkspaces}
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#e3f2fd',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                A
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontSize: '14px', color: '#666' }}>As Member</p>
                <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#666', marginTop: '5px' }}>
                  {userStats.memberWorkspaces}
                </p>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                background: '#f5f5f5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                M
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="card">
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Account Information</h2>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e0e0e0' }}>
              <span style={{ color: '#666', fontWeight: '500' }}>Name</span>
              <span>{user?.name}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e0e0e0' }}>
              <span style={{ color: '#666', fontWeight: '500' }}>Email</span>
              <span>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #e0e0e0' }}>
              <span style={{ color: '#666', fontWeight: '500' }}>User ID</span>
              <span style={{ color: '#666', fontSize: '14px', fontFamily: 'monospace' }}>{user?.id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
              <span style={{ color: '#666', fontWeight: '500' }}>Member Since</span>
              <span>
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
