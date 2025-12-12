import { useNavigate } from 'react-router-dom';

const TaskCard = ({ task, workspaceId, projectId }) => {
  const navigate = useNavigate();

  // Status badge styles
  const statusStyles = {
    TODO: {
      color: 'bg-gray-200 text-gray-800',
      label: 'To Do'
    },
    IN_PROGRESS: {
      color: 'bg-yellow-200 text-yellow-800',
      label: 'In Progress'
    },
    DONE: {
      color: 'bg-green-200 text-green-800',
      label: 'Done'
    }
  };

  // Priority indicator styles (colored dot)
  const priorityColors = {
    LOW: 'bg-green-500',
    MEDIUM: 'bg-yellow-500',
    HIGH: 'bg-red-500'
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
      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Header: Priority indicator + Title */}
      <div className="flex items-start gap-2 mb-2">
        {/* Priority dot */}
        <span
          className={`h-3 w-3 rounded-full flex-shrink-0 mt-1 ${priorityColors[task.priority]}`}
          title={priorityLabels[task.priority] + ' priority'}
        />

        {/* Task title */}
        <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
          {task.title}
        </h3>
      </div>

      {/* Description preview */}
      {task.description && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Footer: Status badge + Metadata */}
      <div className="flex items-center justify-between">
        {/* Status badge */}
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${statusStyles[task.status].color}`}
        >
          {statusStyles[task.status].label}
        </span>

        {/* Due date */}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>📅</span>
            <span className={isOverdue(task.dueDate) ? 'text-red-600 font-medium' : ''}>
              {formatDate(task.dueDate)}
            </span>
          </div>
        )}
      </div>

      {/* Assignee (if available) */}
      {task.assignee && (
        <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
          <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium">
            {task.assignee.name ? task.assignee.name.charAt(0).toUpperCase() : '?'}
          </div>
          <span>{task.assignee.name || task.assignee.email}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
