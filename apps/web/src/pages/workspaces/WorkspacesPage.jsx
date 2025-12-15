import { useState, useMemo } from 'react';
import { useWorkspaces } from '../../hooks/useWorkspaces';
import WorkspaceCard from '../../components/workspace/WorkspaceCard';
import { useToast } from '../../context/ToastContext';
import { validateLength } from '../../utils/validation';
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
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  CircularProgress,
  Alert,
  Fade,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  FolderSpecial as FolderIcon,
} from '@mui/icons-material';

const WorkspacesPage = () => {
  const {
    workspaces,
    loading,
    error,
    addWorkspace,
    editWorkspace,
    removeWorkspace
  } = useWorkspaces();
  const toast = useToast();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const paginatedWorkspaces = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return workspaces.slice(startIndex, endIndex);
  }, [workspaces, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(workspaces.length / itemsPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validateForm = () => {
    const nameValidation = validateLength(formData.name, 3, 50);
    const descValidation = formData.description
      ? validateLength(formData.description, 0, 500)
      : { valid: true, message: '' };

    setErrors({
      name: nameValidation.valid ? '' : nameValidation.message,
      description: descValidation.valid ? '' : descValidation.message
    });

    return nameValidation.valid && descValidation.valid;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await addWorkspace(formData);
      setShowCreateModal(false);
      setFormData({ name: '', description: '' });
      setErrors({ name: '', description: '' });
      toast.success('Workspace created successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (workspace) => {
    setSelectedWorkspace(workspace);
    setFormData({
      name: workspace.name,
      description: workspace.description || ''
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      await editWorkspace(selectedWorkspace.id, formData);
      setShowEditModal(false);
      setFormData({ name: '', description: '' });
      setSelectedWorkspace(null);
      setErrors({ name: '', description: '' });
      toast.success('Workspace updated successfully');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (workspaceId) => {
    if (window.confirm('Are you sure you want to delete this workspace?')) {
      try {
        await removeWorkspace(workspaceId);
        toast.success('Workspace deleted successfully');
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setFormData({ name: '', description: '' });
    setErrors({ name: '', description: '' });
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setFormData({ name: '', description: '' });
    setSelectedWorkspace(null);
    setErrors({ name: '', description: '' });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress size={60} sx={{ color: 'primary.main' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
        >
          Error: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ height: '100%', overflowY: 'auto', bgcolor: 'grey.50' }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                My Workspaces
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Organize and manage your work across different workspaces
              </Typography>
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
                '&:hover': {
                  boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
                }
              }}
            >
              New Workspace
            </Button>
          </Box>
        </Box>

        {workspaces.length === 0 ? (
          <Fade in={true}>
            <Paper
              elevation={0}
              sx={{
                textAlign: 'center',
                py: 10,
                px: 4,
                border: '2px dashed',
                borderColor: 'grey.300',
                borderRadius: 3,
                bgcolor: 'background.paper',
              }}
            >
              <FolderIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2, opacity: 0.7 }} />
              <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                No workspaces yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Get started by creating your first workspace to organize your projects and tasks
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setShowCreateModal(true)}
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: 'none',
                }}
              >
                Create Your First Workspace
              </Button>
            </Paper>
          </Fade>
        ) : (
          <>
            {/* Filters and Stats */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Chip
                label={`${workspaces.length} ${workspaces.length === 1 ? 'workspace' : 'workspaces'}`}
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <InputLabel>Items per page</InputLabel>
                <Select
                  value={itemsPerPage}
                  label="Items per page"
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <MenuItem value={6}>6 per page</MenuItem>
                  <MenuItem value={9}>9 per page</MenuItem>
                  <MenuItem value={12}>12 per page</MenuItem>
                  <MenuItem value={18}>18 per page</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {/* Workspace Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {paginatedWorkspaces.map((workspace, index) => (
                <Grid item xs={12} sm={6} md={4} key={workspace.id}>
                  <Fade in={true} timeout={300 + index * 100}>
                    <div>
                      <WorkspaceCard
                        workspace={workspace}
                        onEdit={handleEditClick}
                        onDelete={handleDelete}
                      />
                    </div>
                  </Fade>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}
      </Container>

      {/* Create Workspace Dialog */}
      <Dialog
        open={showCreateModal}
        onClose={handleCloseCreateModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', pb: 1 }}>
          Create Workspace
        </DialogTitle>
        <form onSubmit={handleCreate}>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Workspace Name"
                placeholder="My Workspace"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                fullWidth
                required
                inputProps={{ maxLength: 50 }}
                error={!!errors.name}
                helperText={errors.name || `${formData.name.length}/50 characters`}
                autoFocus
              />
              <TextField
                label="Description"
                placeholder="What is this workspace for?"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                fullWidth
                multiline
                rows={3}
                inputProps={{ maxLength: 500 }}
                error={!!errors.description}
                helperText={errors.description || `${formData.description.length}/500 characters`}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleCloseCreateModal}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Edit Workspace Dialog */}
      <Dialog
        open={showEditModal}
        onClose={handleCloseEditModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 700, fontSize: '1.5rem', pb: 1 }}>
          Edit Workspace
        </DialogTitle>
        <form onSubmit={handleUpdate}>
          <DialogContent sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="Workspace Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                fullWidth
                required
                inputProps={{ maxLength: 50 }}
                error={!!errors.name}
                helperText={errors.name || `${formData.name.length}/50 characters`}
                autoFocus
              />
              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                fullWidth
                multiline
                rows={3}
                inputProps={{ maxLength: 500 }}
                error={!!errors.description}
                helperText={errors.description || `${formData.description.length}/500 characters`}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button
              onClick={handleCloseEditModal}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
              }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Update'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default WorkspacesPage;
