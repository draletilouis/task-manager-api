import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getWorkspaces } from '../../api/workspaces';
import { getProjects } from '../../api/projects';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Collapse,
  Box,
  Typography,
  Divider,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Article as ArticleIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  WorkspacesOutlined as WorkspacesIcon,
} from '@mui/icons-material';

const DRAWER_WIDTH = 260;
const DRAWER_COLLAPSED_WIDTH = 72;

const Sidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [workspaces, setWorkspaces] = useState([]);
  const [expandedWorkspaces, setExpandedWorkspaces] = useState(new Set());
  const [workspaceProjects, setWorkspaceProjects] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch workspaces on mount
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        setLoading(true);
        const data = await getWorkspaces();
        setWorkspaces(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching workspaces:', error);
        setWorkspaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  // Toggle workspace expansion and fetch projects if needed
  const toggleWorkspace = async (workspaceId, e) => {
    e.preventDefault();
    e.stopPropagation();

    const newExpanded = new Set(expandedWorkspaces);

    if (newExpanded.has(workspaceId)) {
      newExpanded.delete(workspaceId);
    } else {
      newExpanded.add(workspaceId);

      // Fetch projects if not already loaded
      if (!workspaceProjects[workspaceId]) {
        try {
          const projects = await getProjects(workspaceId);
          setWorkspaceProjects(prev => ({
            ...prev,
            [workspaceId]: projects
          }));
        } catch (error) {
          console.error(`Error fetching projects for workspace ${workspaceId}:`, error);
        }
      }
    }

    setExpandedWorkspaces(newExpanded);
  };

  // Check if a path is active
  const isActive = (path) => location.pathname === path;
  const isWorkspaceActive = (workspaceId) => location.pathname.includes(`/workspaces/${workspaceId}`);
  const isProjectActive = (workspaceId, projectId) =>
    location.pathname.includes(`/workspaces/${workspaceId}/projects/${projectId}`);

  // Generate color for workspace
  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH,
          boxSizing: 'border-box',
          borderRight: '1px solid',
          borderColor: 'divider',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
        },
      }}
    >
      {/* Toggle Button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-end',
          p: 1,
          minHeight: 64,
        }}
      >
        <Tooltip title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'} placement="right">
          <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>

      <Divider />

      {/* Workspaces Section */}
      <Box sx={{ overflowY: 'auto', overflowX: 'hidden', flexGrow: 1 }}>
        <List>
          {/* Section Header */}
          {!isCollapsed && (
            <ListItem sx={{ pt: 2, pb: 1 }}>
              <Typography
                variant="overline"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'text.secondary',
                  letterSpacing: 1,
                }}
              >
                Workspaces
              </Typography>
            </ListItem>
          )}

          {loading ? (
            <ListItem sx={{ justifyContent: 'center', py: 3 }}>
              <CircularProgress size={24} />
            </ListItem>
          ) : workspaces.length === 0 ? (
            !isCollapsed && (
              <ListItem>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                  No workspaces yet
                </Typography>
              </ListItem>
            )
          ) : (
            workspaces.map((workspace) => {
              const isExpanded = expandedWorkspaces.has(workspace.id);
              const projects = workspaceProjects[workspace.id] || [];
              const active = isWorkspaceActive(workspace.id);
              const workspaceColor = stringToColor(workspace.name);

              return (
                <Box key={workspace.id}>
                  <ListItemButton
                    component={Link}
                    to={`/workspaces/${workspace.id}`}
                    selected={active}
                    sx={{
                      pl: isCollapsed ? 1.5 : 2,
                      pr: isCollapsed ? 1.5 : 1,
                      py: 1,
                      borderRadius: isCollapsed ? 0 : 1,
                      mx: isCollapsed ? 0 : 1,
                      '&.Mui-selected': {
                        bgcolor: 'primary.light',
                        '&:hover': {
                          bgcolor: 'primary.light',
                        },
                      },
                    }}
                  >
                    <Tooltip title={isCollapsed ? workspace.name : ''} placement="right">
                      <ListItemIcon sx={{ minWidth: isCollapsed ? 'auto' : 40 }}>
                        {isExpanded ? (
                          <FolderOpenIcon sx={{ color: workspaceColor }} />
                        ) : (
                          <FolderIcon sx={{ color: workspaceColor }} />
                        )}
                      </ListItemIcon>
                    </Tooltip>
                    {!isCollapsed && (
                      <>
                        <ListItemText
                          primary={workspace.name}
                          primaryTypographyProps={{
                            fontSize: '0.9rem',
                            fontWeight: active ? 600 : 400,
                            noWrap: true,
                          }}
                        />
                        <IconButton
                          size="small"
                          onClick={(e) => toggleWorkspace(workspace.id, e)}
                          sx={{ ml: 'auto' }}
                        >
                          {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>
                      </>
                    )}
                  </ListItemButton>

                  {/* Projects Submenu */}
                  {!isCollapsed && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {projects.length === 0 ? (
                          <ListItem sx={{ pl: 7 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                              No projects yet
                            </Typography>
                          </ListItem>
                        ) : (
                          projects.map((project) => (
                            <ListItemButton
                              key={project.id}
                              component={Link}
                              to={`/workspaces/${workspace.id}/projects/${project.id}`}
                              selected={isProjectActive(workspace.id, project.id)}
                              sx={{
                                pl: 7,
                                py: 0.75,
                                borderRadius: 1,
                                mx: 1,
                                '&.Mui-selected': {
                                  bgcolor: 'action.selected',
                                  '&:hover': {
                                    bgcolor: 'action.selected',
                                  },
                                },
                              }}
                            >
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <ArticleIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={project.name}
                                primaryTypographyProps={{
                                  fontSize: '0.85rem',
                                  noWrap: true,
                                }}
                              />
                            </ListItemButton>
                          ))
                        )}
                      </List>
                    </Collapse>
                  )}
                </Box>
              );
            })
          )}
        </List>

        <Divider sx={{ my: 2 }} />

        {/* Quick Links Section */}
        <List>
          {!isCollapsed && (
            <ListItem sx={{ pb: 1 }}>
              <Typography
                variant="overline"
                sx={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'text.secondary',
                  letterSpacing: 1,
                }}
              >
                Quick Links
              </Typography>
            </ListItem>
          )}

          <ListItemButton
            component={Link}
            to="/profile"
            selected={isActive('/profile')}
            sx={{
              pl: isCollapsed ? 1.5 : 2,
              pr: isCollapsed ? 1.5 : 2,
              py: 1,
              borderRadius: isCollapsed ? 0 : 1,
              mx: isCollapsed ? 0 : 1,
              '&.Mui-selected': {
                bgcolor: 'action.selected',
              },
            }}
          >
            <Tooltip title={isCollapsed ? 'Profile' : ''} placement="right">
              <ListItemIcon sx={{ minWidth: isCollapsed ? 'auto' : 40 }}>
                <PersonIcon />
              </ListItemIcon>
            </Tooltip>
            {!isCollapsed && (
              <ListItemText
                primary="Profile"
                primaryTypographyProps={{ fontSize: '0.9rem' }}
              />
            )}
          </ListItemButton>

          <ListItemButton
            component={Link}
            to="/settings"
            selected={isActive('/settings')}
            sx={{
              pl: isCollapsed ? 1.5 : 2,
              pr: isCollapsed ? 1.5 : 2,
              py: 1,
              borderRadius: isCollapsed ? 0 : 1,
              mx: isCollapsed ? 0 : 1,
              '&.Mui-selected': {
                bgcolor: 'action.selected',
              },
            }}
          >
            <Tooltip title={isCollapsed ? 'Settings' : ''} placement="right">
              <ListItemIcon sx={{ minWidth: isCollapsed ? 'auto' : 40 }}>
                <SettingsIcon />
              </ListItemIcon>
            </Tooltip>
            {!isCollapsed && (
              <ListItemText
                primary="Settings"
                primaryTypographyProps={{ fontSize: '0.9rem' }}
              />
            )}
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
