import { useState, useEffect } from 'react';
import { getWorkspaceMembers } from '../../api/workspaces';

const TaskForm = ({ onSubmit, onCancel, initialData = null, workspaceId }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    status: initialData?.status || 'TODO',
    priority: initialData?.priority || 'MEDIUM',
    dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    assigneeId: initialData?.assignee?.id || '',
  });

  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      if (!workspaceId) return;

      try {
        setLoadingMembers(true);
        const data = await getWorkspaceMembers(workspaceId);
        setMembers(data);
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [workspaceId]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      };
      await onSubmit(taskData);
    } catch (error) {
      console.error('Task form error:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {/* Title */}
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
          Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter task title"
          required
          style={{ width: '100%' }}
        />
        {errors.title && <p className="error" style={{ marginTop: '5px' }}>{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter task description (optional)"
          rows={4}
          style={{ width: '100%' }}
        />
      </div>

      {/* Status */}
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
          Status
        </label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={{ width: '100%' }}
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>

      {/* Priority */}
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
          Priority
        </label>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          style={{ width: '100%' }}
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      {/* Due Date */}
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
          Due Date
        </label>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </div>

      {/* Assignee */}
      <div>
        <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
          Assignee
        </label>
        <select
          name="assigneeId"
          value={formData.assigneeId}
          onChange={handleChange}
          disabled={loadingMembers}
          style={{ width: '100%' }}
        >
          <option value="">Unassigned</option>
          {members.map(member => (
            <option key={member.userId} value={member.userId}>
              {member.user?.email || 'Unknown User'}
            </option>
          ))}
        </select>
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <div className="error">{errors.submit}</div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '15px' }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
