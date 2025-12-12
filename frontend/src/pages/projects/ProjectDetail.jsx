import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../hooks/useProjects';
import TaskBoard from '../../components/task/TaskBoard';
import Modal from '../../components/common/Modal';
import TaskForm from '../../components/task/TaskForm';
import Button from '../../components/common/Button';

const ProjectDetail = () => {
  const { workspaceId, projectId } = useParams();
  const navigate = useNavigate();
  const { tasks, loading: tasksLoading, error: tasksError, addTask, fetchTasks } = useTasks(workspaceId, projectId);
  const { projects, loading: projectsLoading } = useProjects(workspaceId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState(null);

  useEffect(() => {
    if (projects.length > 0) {
      const project = projects.find(p => p.id === parseInt(projectId));
      setCurrentProject(project);
    }
  }, [projects, projectId]);

  const handleCreateTask = async (taskData) => {
    try {
      await addTask(taskData);
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task: ' + error.message);
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

      {/* Task Board */}
      <TaskBoard
        tasks={tasks}
        workspaceId={workspaceId}
        projectId={projectId}
        loading={tasksLoading}
        error={tasksError}
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
