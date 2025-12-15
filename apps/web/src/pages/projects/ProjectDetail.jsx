import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import TaskBoard from '../../components/task/TaskBoard';
import TaskFilterBar from '../../components/task/TaskFilterBar';
import Modal from '../../components/common/Modal';
import TaskForm from '../../components/task/TaskForm';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const ProjectDetail = () => {
  const { workspaceId, projectId } = useParams();
  const toast = useToast();
  const { tasks, loading: tasksLoading, error: tasksError, addTask, fetchTasks } = useTasks(workspaceId, projectId);
  const { projects, loading: projectsLoading } = useProjects(workspaceId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assigneeId: '',
    search: '',
    sortBy: 'createdAt'
  });

  useEffect(() => {
    if (projects.length > 0) {
      const project = projects.find(p => p.id === parseInt(projectId));
      setCurrentProject(project);
    }
  }, [projects, projectId]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task =>
        task.title?.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
    }

    // Apply priority filter
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Apply assignee filter
    if (filters.assigneeId) {
      if (filters.assigneeId === 'unassigned') {
        filtered = filtered.filter(task => !task.assigneeId);
      } else {
        filtered = filtered.filter(task => task.assigneeId === parseInt(filters.assigneeId));
      }
    }

    // Apply sorting
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdAt':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [tasks, filters]);

  const handleCreateTask = async (taskData) => {
    try {
      await addTask(taskData);
      setIsModalOpen(false);
      fetchTasks();
      toast.success('Task created successfully');
    } catch (error) {
      console.error('Failed to create task:', error);
      toast.error('Failed to create task: ' + error.message);
    }
  };

  if (projectsLoading) {
    return (
      <div style={{ height: '100%', overflowY: 'auto' }}>
        <div className="container">
          <div style={{ color: '#666' }}>Loading project...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div className="container">
      {/* Breadcrumb Navigation */}
      <nav style={{ fontSize: '14px', marginBottom: '15px', color: '#666' }}>
        <Link to="/workspaces">Workspaces</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <Link to={`/workspaces/${workspaceId}`}>Workspace</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: '#333', fontWeight: '500' }}>{currentProject?.name || 'Project'}</span>
      </nav>

      {/* Project Header */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>
              {currentProject?.name || 'Project Detail'}
            </h1>
            {currentProject?.description && (
              <p style={{ color: '#666' }}>{currentProject.description}</p>
            )}
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            Create Task
          </Button>
        </div>
      </div>

      {/* Task Filter Bar */}
      <TaskFilterBar
        workspaceId={workspaceId}
        onFilterChange={setFilters}
      />

      {/* Task Board */}
      <TaskBoard
        tasks={filteredTasks}
        workspaceId={workspaceId}
        projectId={projectId}
        loading={tasksLoading}
        error={tasksError}
        onTaskUpdate={fetchTasks}
      />

      {/* Create Task Modal */}
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          title="Create New Task"
        >
          <TaskForm
            onSubmit={handleCreateTask}
            onCancel={() => setIsModalOpen(false)}
            workspaceId={workspaceId}
            projectId={projectId}
          />
        </Modal>
      )}
      </div>
    </div>
  );
};

export default ProjectDetail;
