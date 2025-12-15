import { useParams, Link } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { useState, useEffect } from 'react';
import { getWorkspace, getWorkspaceMembers, addWorkspaceMember, removeWorkspaceMember, updateWorkspaceMemberRole } from '../../api/workspaces';
import { useToast } from '../../context/ToastContext';
import { isValidEmail } from '../../utils/validation';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Fade,
} from '@mui/material';
import {
  Add as AddIcon,
  Article as ArticleIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  PersonAdd as PersonAddIcon,
  ArrowForward as ArrowForwardIcon,
  FolderOpen as FolderOpenIcon,
} from '@mui/icons-material';

const WorkspaceDetail = () => {
  const { workspaceId } = useParams();
  const toast = useToast();

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

  const [workspace, setWorkspace] = useState(null);
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isInviting, setIsInviting] = useState(false);

  useEffect(() => {
    const fetchWorkspace = async () => {
      try {
        setLoadingWorkspace(true);
        const data = await getWorkspace(workspaceId);
        setWorkspace(data);
      } catch (error) {
        console.error('Failed to fetch workspace:', error);
        toast.error('Failed to load workspace');
      } finally {
        setLoadingWorkspace(false);
      }
    };

    fetchWorkspace();
  }, [workspaceId]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoadingMembers(true);
        const data = await getWorkspaceMembers(workspaceId);
        setMembers(data);
      } catch (error) {
        console.error('Failed to fetch members:', error);
        toast.error('Failed to load members');
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [workspaceId]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await addProject(formData);
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
      toast.success('Project created successfully');
    } catch (error) {
      toast.error(error.message);
    }
  };

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
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await removeProject(projectId);
        toast.success('Project deleted successfully');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    setEmailError('');

    if (!isValidEmail(inviteEmail)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    try {
      setIsInviting(true);
      await addWorkspaceMember(workspaceId, { email: inviteEmail });
      const updatedMembers = await getWorkspaceMembers(workspaceId);
      setMembers(updatedMembers);
      setShowInviteModal(false);
      setInviteEmail('');
      toast.success('Member invited successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this member?')) {
      try {
        await removeWorkspaceMember(workspaceId, memberId);
        const updatedMembers = await getWorkspaceMembers(workspaceId);
        setMembers(updatedMembers);
        toast.success('Member removed successfully');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const stringToColor = (string) => {
    if (!string) return 'hsl(200, 70%, 50%)';
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  if (loadingWorkspace) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'grey.50' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link to="/workspaces" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Typography color="text.secondary" sx={{ '&:hover': { color: 'primary.main' } }}>
              Workspaces
            </Typography>
          </Link>
          <Typography color="text.primary" sx={{ fontWeight: 600 }}>
            {workspace?.name || 'Workspace'}
          </Typography>
        </Breadcrumbs>

        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <FolderOpenIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {workspace?.name || 'Workspace'}
                </Typography>
              </Box>
              {workspace?.description && (
                <Typography variant="body1" color="text.secondary" sx={{ ml: 7 }}>
                  {workspace.description}
                </Typography>
              )}
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowCreateModal(true)}
              sx={{
                px: 3,
                py: 1.5,
                fontWeight: 600,
                textTransform: 'none',
                boxShadow: '0 4px 14px rgba(46, 125, 50, 0.3)',
              }}
            >
              New Project
            </Button>
          </Box>
        </Box>

        {/* Projects Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            Projects
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : projects.length === 0 ? (
            <Fade in={true}>
              <Paper
                elevation={0}
                sx={{
                  textAlign: 'center',
                  py: 8,
                  px: 4,
                  border: '2px dashed',
                  borderColor: 'grey.300',
                  borderRadius: 2,
                }}
              >
                <ArticleIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2, opacity: 0.7 }} />
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  No projects yet
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Get started by creating your first project
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setShowCreateModal(true)}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Create First Project
                </Button>
              </Paper>
            </Fade>
          ) : (
            <Grid container spacing={3}>
              {projects.map((project, index) => (
                <Grid item xs={12} sm={6} md={4} key={project.id}>
                  <Fade in={true} timeout={300 + index * 100}>
                    <Card
                      elevation={0}
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid',
                        borderColor: 'grey.200',
                        borderRadius: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                          transform: 'translateY(-4px)',
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                          <ArticleIcon sx={{ color: stringToColor(project.name), fontSize: 28 }} />
                          <Typography variant="h6" sx={{ fontWeight: 700 }}>
                            {project.name}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            mb: 2,
                            minHeight: '40px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {project.description || 'No description'}
                        </Typography>
                      </CardContent>
                      <Divider />
                      <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
                        <Button
                          component={Link}
                          to={`/workspaces/${workspaceId}/projects/${project.id}`}
                          endIcon={<ArrowForwardIcon />}
                          size="small"
                          sx={{ textTransform: 'none', fontWeight: 600 }}
                        >
                          View
                        </Button>
                        <Box>
                          <IconButton size="small" onClick={() => handleEditProjectClick(project)}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteProject(project.id)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardActions>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Members Section */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Members
            </Typography>
            <Button
              variant="outlined"
              startIcon={<PersonAddIcon />}
              onClick={() => setShowInviteModal(true)}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Invite Member
            </Button>
          </Box>

          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'grey.200', borderRadius: 2 }}>
            {loadingMembers ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress />
              </Box>
            ) : members.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 5 }}>
                <PeopleIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No members yet
                </Typography>
              </Box>
            ) : (
              <List>
                {members.map((member, index) => (
                  <Box key={member.id}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: stringToColor(member.email) }}>
                          {member.email?.charAt(0)?.toUpperCase() || 'U'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {member.name || member.email}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                            <Typography variant="body2" color="text.secondary">
                              {member.email}
                            </Typography>
                            <Chip label={member.role} size="small" color="primary" variant="outlined" />
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        {member.role !== 'OWNER' && (
                          <IconButton
                            edge="end"
                            onClick={() => handleRemoveMember(member.userId)}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < members.length - 1 && <Divider />}
                  </Box>
                ))}
              </List>
            )}
          </Paper>
        </Box>
      </Container>

      {/* Create Project Dialog */}
      <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>Create Project</DialogTitle>
        <form onSubmit={handleCreateProject}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Project Name"
                placeholder="My Project"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
                autoFocus
              />
              <TextField
                label="Description"
                placeholder="What is this project about?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setShowCreateModal(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}>
              Create
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={showEditProjectModal} onClose={() => setShowEditProjectModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>Edit Project</DialogTitle>
        <form onSubmit={handleUpdateProject}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Project Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                fullWidth
                required
                autoFocus
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                fullWidth
                multiline
                rows={3}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setShowEditProjectModal(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}>
              Update
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Invite Member Dialog */}
      <Dialog open={showInviteModal} onClose={() => setShowInviteModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem' }}>Invite Member</DialogTitle>
        <form onSubmit={handleInviteMember}>
          <DialogContent>
            <TextField
              label="Email Address"
              type="email"
              placeholder="member@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              fullWidth
              required
              autoFocus
              error={!!emailError}
              helperText={emailError}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setShowInviteModal(false)} sx={{ textTransform: 'none', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isInviting}
              sx={{ textTransform: 'none', fontWeight: 600, px: 3 }}
            >
              {isInviting ? <CircularProgress size={24} /> : 'Invite'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default WorkspaceDetail;
