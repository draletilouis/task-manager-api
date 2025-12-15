import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Chip,
  Avatar,
  Divider,
  Button,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  Folder as FolderIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const WorkspaceCard = ({ workspace, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    onEdit(workspace);
    handleMenuClose();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    onDelete(workspace.id);
    handleMenuClose();
  };

  // Generate color based on workspace name
  const stringToColor = (string) => {
    if (!string) return 'hsl(200, 70%, 50%)'; // Default color
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  const workspaceColor = stringToColor(workspace?.name || 'W');

  return (
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
      {/* Header with Icon and Menu */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${workspaceColor}15 0%, ${workspaceColor}05 100%)`,
          p: 2,
          pb: 1,
          position: 'relative',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Avatar
            sx={{
              bgcolor: workspaceColor,
              width: 48,
              height: 48,
              fontWeight: 700,
              fontSize: '1.2rem',
            }}
          >
            {workspace?.name?.charAt(0)?.toUpperCase() || 'W'}
          </Avatar>

          <IconButton
            size="small"
            onClick={handleMenuClick}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.05)',
              },
            }}
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleEdit}>
              <EditIcon sx={{ mr: 1.5, fontSize: 20 }} />
              Edit
            </MenuItem>
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <DeleteIcon sx={{ mr: 1.5, fontSize: 20 }} />
              Delete
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Content */}
      <CardContent sx={{ flexGrow: 1, pt: 2 }}>
        <Link to={`/workspaces/${workspace.id}`} style={{ textDecoration: 'none' }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 0.5,
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            {workspace.name}
          </Typography>
        </Link>

        <Chip
          label={workspace.role || 'Member'}
          size="small"
          sx={{
            mb: 2,
            height: 20,
            fontSize: '0.7rem',
            fontWeight: 600,
            bgcolor: `${workspaceColor}20`,
            color: workspaceColor,
            border: 'none',
          }}
        />

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
          {workspace.description || 'No description provided'}
        </Typography>
      </CardContent>

      <Divider />

      {/* Footer */}
      <CardActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PeopleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {workspace.memberCount || 0} {workspace.memberCount === 1 ? 'member' : 'members'}
          </Typography>
        </Box>

        <Button
          component={Link}
          to={`/workspaces/${workspace.id}`}
          endIcon={<ArrowForwardIcon />}
          size="small"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
          }}
        >
          View
        </Button>
      </CardActions>
    </Card>
  );
};

export default WorkspaceCard;
