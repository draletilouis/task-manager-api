import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTask, updateTask, deleteTask } from '../../api/tasks';
import { useComments } from '../../hooks/useComments';
import { getWorkspaceMembers } from '../../api/workspaces';
import Modal from '../../components/common/Modal';
import TaskForm from '../../components/task/TaskForm';
import CommentList from '../../components/comment/CommentList';
import CommentForm from '../../components/comment/CommentForm';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';

const TaskDetail = () => {
  const { workspaceId, projectId, taskId } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditingAssignee, setIsEditingAssignee] = useState(false);
  const [members, setMembers] = useState([]);

  const { comments, loading: commentsLoading, addComment, editComment, removeComment } = useComments(taskId);

  // Fetch workspace members for assignee dropdown
  useEffect(() => {
    const fetchMembers = async () => {
      if (!workspaceId) return;
      try {
        const data = await getWorkspaceMembers(workspaceId);
        setMembers(data);
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    };
    fetchMembers();
  }, [workspaceId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      const data = await getTask(workspaceId, projectId, taskId);
      setTask(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [workspaceId, projectId, taskId]);

  const handleEditTask = async (taskData) => {
    try {
      const updated = await updateTask(workspaceId, projectId, taskId, taskData);
      setTask(updated);
      setIsEditModalOpen(false);
      toast.success('Task updated successfully');
    } catch (error) {
      console.error('Failed to update task:', error);
      toast.error('Failed to update task: ' + error.message);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(workspaceId, projectId, taskId);
      toast.success('Task deleted successfully');
      navigate(`/workspaces/${workspaceId}/projects/${projectId}`);
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task: ' + error.message);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const updated = await updateTask(workspaceId, projectId, taskId, {
        ...task,
        status: newStatus
      });
      setTask(updated);
      toast.success('Status updated successfully');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status: ' + error.message);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    try {
      const updated = await updateTask(workspaceId, projectId, taskId, {
        ...task,
        priority: newPriority
      });
      setTask(updated);
      toast.success('Priority updated successfully');
    } catch (error) {
      console.error('Failed to update priority:', error);
      toast.error('Failed to update priority: ' + error.message);
    }
  };

  const handleAssigneeChange = async (newAssigneeId) => {
    try {
      const updated = await updateTask(workspaceId, projectId, taskId, {
        ...task,
        assigneeId: newAssigneeId || null
      });
      setTask(updated);
      setIsEditingAssignee(false);
      toast.success('Assignee updated successfully');
    } catch (error) {
      console.error('Failed to update assignee:', error);
      toast.error('Failed to update assignee: ' + error.message);
    }
  };

  const handleAddComment = async (commentData) => {
    try {
      await addComment(commentData);
      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Failed to add comment:', error);
      toast.error('Failed to add comment: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div style={{ height: '100%', overflowY: 'auto' }}>
        <div className="container">
          <div style={{ color: '#666' }}>Loading task...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ height: '100%', overflowY: 'auto' }}>
        <div className="container">
          <div className="error">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div style={{ height: '100%', overflowY: 'auto' }}>
        <div className="container">
          <div style={{ color: '#666' }}>Task not found</div>
        </div>
      </div>
    );
  }

  const statusLabels = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done'
  };

  const priorityLabels = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High'
  };

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <div className="container">
      {/* Breadcrumb Navigation */}
      <nav style={{ fontSize: '14px', marginBottom: '15px', color: '#666' }}>
        <Link to="/workspaces">Workspaces</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <Link to={`/workspaces/${workspaceId}`}>Workspace</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <Link to={`/workspaces/${workspaceId}/projects/${projectId}`}>Project</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: '#333', fontWeight: '500' }}>Task</span>
      </nav>

      {/* Task Header */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '10px' }}>{task.title}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>[{priorityLabels[task.priority]}]</span>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>{statusLabels[task.status]}</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button onClick={() => setIsEditModalOpen(true)} variant="secondary">
              Edit
            </Button>
            <Button onClick={() => setIsDeleteModalOpen(true)} variant="danger">
              Delete
            </Button>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '15px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Description</h2>
          <p style={{ color: '#666' }}>{task.description || 'No description provided'}</p>
        </div>

        {/* Due Date */}
        {task.dueDate && (
          <div style={{ marginBottom: '15px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Due Date</h2>
            <p style={{ color: '#666' }}>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
          </div>
        )}

        {/* Assignee */}
        <div style={{ marginBottom: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Assigned To</h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditingAssignee(!isEditingAssignee)}
            >
              {isEditingAssignee ? 'Cancel' : 'Change'}
            </Button>
          </div>
          {isEditingAssignee ? (
            <select
              value={task.assigneeId || ''}
              onChange={(e) => handleAssigneeChange(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">Unassigned</option>
              {members.map(member => (
                <option key={member.userId} value={member.userId}>
                  {member.user?.email || 'Unknown User'}
                </option>
              ))}
            </select>
          ) : (
            <p style={{ color: '#666' }}>
              {task.assignee ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#0066cc',
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {task.assignee.email?.charAt(0).toUpperCase() || '?'}
                  </span>
                  {task.assignee.email || 'Unknown User'}
                </span>
              ) : (
                'Unassigned'
              )}
            </p>
          )}
        </div>

        {/* Status Update */}
        <div style={{ marginBottom: '15px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Update Status</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleStatusChange('TODO')}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                background: task.status === 'TODO' ? '#e0e0e0' : '#f5f5f5',
                border: '1px solid #ddd',
                cursor: 'pointer'
              }}
            >
              To Do
            </button>
            <button
              onClick={() => handleStatusChange('IN_PROGRESS')}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                background: task.status === 'IN_PROGRESS' ? '#fff3cd' : '#fffbf0',
                border: '1px solid #ddd',
                cursor: 'pointer'
              }}
            >
              In Progress
            </button>
            <button
              onClick={() => handleStatusChange('DONE')}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                background: task.status === 'DONE' ? '#d4edda' : '#f0f8f0',
                border: '1px solid #ddd',
                cursor: 'pointer'
              }}
            >
              Done
            </button>
          </div>
        </div>

        {/* Priority Update */}
        <div style={{ marginBottom: '15px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Update Priority</h2>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handlePriorityChange('LOW')}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                background: task.priority === 'LOW' ? '#d4edda' : '#f0f8f0',
                border: '1px solid #ddd',
                cursor: 'pointer'
              }}
            >
              Low
            </button>
            <button
              onClick={() => handlePriorityChange('MEDIUM')}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                background: task.priority === 'MEDIUM' ? '#fff3cd' : '#fffbf0',
                border: '1px solid #ddd',
                cursor: 'pointer'
              }}
            >
              Medium
            </button>
            <button
              onClick={() => handlePriorityChange('HIGH')}
              style={{
                padding: '8px 16px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                background: task.priority === 'HIGH' ? '#f8d7da' : '#fff5f5',
                border: '1px solid #ddd',
                cursor: 'pointer'
              }}
            >
              High
            </button>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="card">
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '15px' }}>
          Comments ({comments.length})
        </h2>

        {/* Add Comment Form */}
        <div style={{ marginBottom: '20px' }}>
          <CommentForm onSubmit={handleAddComment} />
        </div>

        {/* Comments List */}
        <CommentList
          comments={comments}
          loading={commentsLoading}
          onEdit={editComment}
          onDelete={removeComment}
        />
      </div>

      {/* Edit Task Modal */}
      {isEditModalOpen && (
        <Modal
          onClose={() => setIsEditModalOpen(false)}
          title="Edit Task"
        >
          <TaskForm
            onSubmit={handleEditTask}
            onCancel={() => setIsEditModalOpen(false)}
            initialData={task}
            workspaceId={workspaceId}
            projectId={projectId}
          />
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <Modal
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Task"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <p style={{ color: '#666' }}>
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => setIsDeleteModalOpen(false)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button onClick={handleDeleteTask} variant="danger">
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      )}
      </div>
    </div>
  );
};

export default TaskDetail;
