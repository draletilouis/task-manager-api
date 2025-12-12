import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { useState } from 'react';
import TaskCard from './TaskCard';
import DraggableTaskCard from './DraggableTaskCard';
import { updateTask } from '../../api/tasks';
import { useToast } from '../../context/ToastContext';

const DroppableColumn = ({ id, title, bgColor, tasks, workspaceId, projectId }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`${bgColor} rounded-lg p-4 min-h-[400px] transition-all ${
        isOver ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
      }`}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-700">{title}</h2>
        <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
          {tasks.length}
        </span>
      </div>

      {/* Task cards */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-400 text-sm py-8">
            No tasks
          </div>
        ) : (
          tasks.map(task => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              workspaceId={workspaceId}
              projectId={projectId}
            />
          ))
        )}
      </div>
    </div>
  );
};

const TaskBoard = ({ tasks = [], workspaceId, projectId, loading, error, onTaskUpdate }) => {
  const [activeId, setActiveId] = useState(null);
  const toast = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Group tasks by status
  const groupTasksByStatus = () => {
    return {
      TODO: tasks.filter(task => task.status === 'TODO'),
      IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS'),
      DONE: tasks.filter(task => task.status === 'DONE')
    };
  };

  const groupedTasks = groupTasksByStatus();

  // Column configuration
  const columns = [
    {
      id: 'TODO',
      title: 'To Do',
      tasks: groupedTasks.TODO,
      bgColor: 'bg-gray-50'
    },
    {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      tasks: groupedTasks.IN_PROGRESS,
      bgColor: 'bg-yellow-50'
    },
    {
      id: 'DONE',
      title: 'Done',
      tasks: groupedTasks.DONE,
      bgColor: 'bg-green-50'
    }
  ];

  // Handle drag start
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Handle drag end
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    // Find the task being dragged
    const task = tasks.find(t => t.id === taskId);

    if (!task || task.status === newStatus) return;

    // Update task status
    try {
      await updateTask(workspaceId, projectId, taskId, { status: newStatus });
      toast.success(`Task moved to ${newStatus.replace('_', ' ')}`);

      // Call parent callback to refetch tasks
      if (onTaskUpdate) {
        onTaskUpdate();
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const activeTask = activeId ? tasks.find(t => t.id === activeId) : null;

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">Error loading tasks: {error}</div>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map(column => (
          <DroppableColumn
            key={column.id}
            id={column.id}
            title={column.title}
            bgColor={column.bgColor}
            tasks={column.tasks}
            workspaceId={workspaceId}
            projectId={projectId}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-80">
            <TaskCard
              task={activeTask}
              workspaceId={workspaceId}
              projectId={projectId}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskBoard;
