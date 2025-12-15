import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import { useState } from 'react';
import TaskCard from './TaskCard';
import DraggableTaskCard from './DraggableTaskCard';
import { updateTask } from '../../api/tasks';
import { useToast } from '../../context/ToastContext';

const DroppableColumn = ({ id, title, tasks, workspaceId, projectId }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        background: '#f5f5f5',
        border: isOver ? '2px solid #0066cc' : '1px solid #ddd',
        borderRadius: '4px',
        padding: '15px',
        minHeight: '400px'
      }}
    >
      {/* Column header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', margin: 0 }}>{title}</h2>
        <span style={{
          background: '#fff',
          padding: '2px 8px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500'
        }}>
          {tasks.length}
        </span>
      </div>

      {/* Task cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {tasks.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', fontSize: '14px', padding: '30px 0' }}>
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
      tasks: groupedTasks.TODO
    },
    {
      id: 'IN_PROGRESS',
      title: 'In Progress',
      tasks: groupedTasks.IN_PROGRESS
    },
    {
      id: 'DONE',
      title: 'Done',
      tasks: groupedTasks.DONE
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div style={{ color: '#666' }}>Loading tasks...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div className="error">Error loading tasks: {error}</div>
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {columns.map(column => (
          <DroppableColumn
            key={column.id}
            id={column.id}
            title={column.title}
            tasks={column.tasks}
            workspaceId={workspaceId}
            projectId={projectId}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div style={{ opacity: 0.8 }}>
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
