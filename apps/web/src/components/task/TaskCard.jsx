import { useNavigate } from 'react-router-dom';

const TaskCard = ({ task, workspaceId, projectId }) => {
  const navigate = useNavigate();

  // Status labels
  const statusLabels = {
    TODO: 'To Do',
    IN_PROGRESS: 'In Progress',
    DONE: 'Done'
  };

  // Priority labels
  const priorityLabels = {
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High'
  };

  // Handle card click - navigate to task detail
  const handleClick = () => {
    navigate(`/workspaces/${workspaceId}/projects/${projectId}/tasks/${task.id}`);
  };

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Check if task is overdue
  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  return (
    <div
      onClick={handleClick}
      className="card"
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Header: Priority + Title */}
      <div style={{ marginBottom: '10px' }}>
        <span style={{ fontSize: '12px', color: '#666' }}>
          [{priorityLabels[task.priority]}]
        </span>
        <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '5px 0' }}>
          {task.title}
        </h3>
      </div>

      {/* Description preview */}
      {task.description && (
        <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
          {task.description}
        </p>
      )}

      {/* Footer: Status + Metadata */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #eee',
        paddingTop: '10px'
      }}>
        {/* Status badge */}
        <span style={{ fontSize: '12px', fontWeight: '500' }}>
          {statusLabels[task.status]}
        </span>

        {/* Due date */}
        {task.dueDate && (
          <div style={{ fontSize: '12px', color: isOverdue(task.dueDate) ? '#d32f2f' : '#666' }}>
            Due: {formatDate(task.dueDate)}
          </div>
        )}
      </div>

      {/* Assignee (if available) */}
      {task.assignee && (
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
          Assigned to: {task.assignee.name || task.assignee.email}
        </div>
      )}
    </div>
  );
};

export default TaskCard;
