import { useState, useEffect } from 'react';
import { getWorkspaceMembers } from '../../api/workspaces';

const TaskFilterBar = ({ workspaceId, onFilterChange }) => {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    assigneeId: '',
    search: ''
  });
  const [members, setMembers] = useState([]);

  // Fetch workspace members for assignee filter
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

  // Handle filter changes
  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Clear all filters
  const handleClearFilters = () => {
    const clearedFilters = {
      status: '',
      priority: '',
      assigneeId: '',
      search: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <div className="card" style={{ marginBottom: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
        {/* Search */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
            Search
          </label>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        {/* Status Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Assignee Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
            Assignee
          </label>
          <select
            value={filters.assigneeId}
            onChange={(e) => handleFilterChange('assigneeId', e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="">All Assignees</option>
            <option value="unassigned">Unassigned</option>
            {members.map(member => (
              <option key={member.userId} value={member.userId}>
                {member.user?.email || 'Unknown User'}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '5px' }}>
            Sort By
          </label>
          <select
            value={filters.sortBy || 'createdAt'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="createdAt">Created Date</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={handleClearFilters}
              style={{ width: '100%' }}
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskFilterBar;
