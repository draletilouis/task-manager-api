import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  const navigate = useNavigate();
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
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'dueDate':
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        case 'priority':
          const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
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
      <div className="container mx-auto p-6">
        <div className="text-gray-500">Loading project...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb Navigation */}
      <nav className="text-sm mb-4 text-gray-600">
        <Link to="/workspaces" className="hover:text-blue-600">Workspaces</Link>
        <span className="mx-2">/</span>
        <Link to={`/workspaces/${workspaceId}`} className="hover:text-blue-600">Workspace</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">{currentProject?.name || 'Project'}</span>
      </nav>

      {/* Project Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {currentProject?.name || 'Project Detail'}
            </h1>
            {currentProject?.description && (
              <p className="text-gray-600 mt-2">{currentProject.description}</p>
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
      <Modal
        isOpen={isModalOpen}
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
    </div>
  );
};

export default ProjectDetail;
