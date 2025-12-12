import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Spinner from '../../components/common/Spinner';
import { getWorkspace, getWorkspaceMembers, addWorkspaceMember, removeWorkspaceMember, updateWorkspaceMemberRole } from '../../api/workspaces';
import { useToast } from '../../context/ToastContext';

const WorkspaceDetail = () => {
  // Get workspaceId from URL
  const { workspaceId } = useParams();
  const toast = useToast();

  // Fetch projects for this workspace
  const {
    projects,
    loading,
    error,
    addProject,
    editProject,
    removeProject
  } = useProjects(workspaceId);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  // Workspace state
  const [workspace, setWorkspace] = useState(null);
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);

  // Members state
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  // Fetch workspace details
  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        setLoadingWorkspace(true);
        const data = await getWorkspace(workspaceId);
        setWorkspace(data);
      } catch (error) {
        console.error('Failed to fetch workspace:', error);
      } finally {
        setLoadingWorkspace(false);
      }
    };

    if (workspaceId) {
      fetchWorkspace();
    }
  }, [workspaceId]);

  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoadingMembers(true);
        const data = await getWorkspaceMembers(workspaceId);
        setMembers(data);
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setLoadingMembers(false);
      }
    };

    if (workspaceId) {
      fetchMembers();
    }
  }, [workspaceId]);

  // Handle create project
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await addProject(formData);
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
      toast.success('Project created successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handle edit project
  const handleEditProjectClick = (project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      description: project.description || ''
    });
    setShowEditProjectModal(true);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      await editProject(selectedProject.id, formData);
      setShowEditProjectModal(false);
      setFormData({ name: '', description: '' });
      setSelectedProject(null);
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handle delete project
  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Delete this project?')) {
      try {
        await removeProject(projectId);
        toast.success('Project deleted successfully');
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  // Handle invite member
  const handleInviteMember = async (e) => {
    e.preventDefault();
    try {
      await addWorkspaceMember(workspaceId, { email: inviteEmail });
      setShowInviteModal(false);
      setInviteEmail('');
      // Refresh members list
      const data = await getWorkspaceMembers(workspaceId);
      setMembers(data);
      toast.success('Member invited successfully');
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Handle change member role
  const handleChangeRole = async (memberId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'MEMBER' : 'ADMIN';
    if (window.confirm(`Change this member's role to ${newRole}?`)) {
      try {
        await updateWorkspaceMemberRole(workspaceId, memberId, newRole);
        // Refresh members list
        const data = await getWorkspaceMembers(workspaceId);
        setMembers(data);
        toast.success('Member role updated successfully');
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  // Handle remove member
  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Remove this member from the workspace?')) {
      try {
        await removeWorkspaceMember(workspaceId, memberId);
        // Refresh members list
        const data = await getWorkspaceMembers(workspaceId);
        setMembers(data);
        toast.success('Member removed successfully');
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  if (loading || loadingWorkspace) return <Spinner />;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb navigation */}
      <nav className="mb-6 text-sm">
        <Link to="/workspaces" className="text-blue-600 hover:underline">
          Workspaces
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{workspace?.name || 'Workspace'}</span>
      </nav>

      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {workspace?.name || 'Workspace'}
          </h1>
          {workspace?.description && (
            <p className="text-gray-600 mt-2">
              {workspace.description}
            </p>
          )}
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          + New Project
        </Button>
      </div>

      {/* Projects section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        
        {projects.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No projects yet</p>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="mt-4"
            >
              Create First Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map(project => (
              <div 
                key={project.id}
                className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">
                  {project.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {project.description}
                </p>
                
                <div className="flex gap-2">
                  <Link
                    to={`/workspaces/${workspaceId}/projects/${project.id}`}
                    className="flex-1"
                  >
                    <Button className="w-full">View</Button>
                  </Link>
                  <Button
                    variant="secondary"
                    onClick={() => handleEditProjectClick(project)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteProject(project.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Members section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Members</h2>
          <Button onClick={() => setShowInviteModal(true)}>
            + Invite Member
          </Button>
        </div>

        {loadingMembers ? (
          <div className="text-gray-500">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-gray-500">No members yet</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border divide-y">
            {members.map(member => (
              <div key={member.userId} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-medium">
                    {member.user?.email?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div>
                    <p className="font-medium">{member.user?.email || 'Unknown User'}</p>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${
                        member.role === 'OWNER' ? 'bg-purple-100 text-purple-700' :
                        member.role === 'ADMIN' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  </div>
                </div>
                {member.role !== 'OWNER' && (
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => handleChangeRole(member.userId, member.role)}
                    >
                      {member.role === 'ADMIN' ? 'Make Member' : 'Make Admin'}
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleRemoveMember(member.userId)}
                    >
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <Modal 
          onClose={() => setShowCreateModal(false)}
          title="Create Project"
        >
          <form onSubmit={handleCreateProject}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">Create</Button>
              <Button 
                type="button"
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Project Modal */}
      {showEditProjectModal && (
        <Modal
          onClose={() => setShowEditProjectModal(false)}
          title="Edit Project"
        >
          <form onSubmit={handleUpdateProject}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">Update</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowEditProjectModal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Invite Member Modal */}
      {showInviteModal && (
        <Modal
          onClose={() => setShowInviteModal(false)}
          title="Invite Member"
        >
          <form onSubmit={handleInviteMember}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="member@example.com"
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1">Invite</Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default WorkspaceDetail;