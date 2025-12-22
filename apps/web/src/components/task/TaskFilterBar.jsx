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
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            placeholder="Search by title or description..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </div>

        {/* Assignee Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Assignee
          </label>
          <select
            value={filters.assigneeId}
            onChange={(e) => handleFilterChange('assigneeId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={handleClearFilters}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
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
