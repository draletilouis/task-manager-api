import { useState, useEffect } from 'react';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject
} from '../api/projects';

export const useProjects = (workspaceId) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects for workspace
  const fetchProjects = async () => {
    if (!workspaceId) return;

    try {
      setLoading(true);
      const data = await getProjects(workspaceId);
      // Extract projects array from response object
      const projectsArray = data?.projects || data;
      // Ensure data is always an array
      setProjects(Array.isArray(projectsArray) ? projectsArray : []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch projects');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when workspaceId changes
  useEffect(() => {
    fetchProjects();
  }, [workspaceId]);

  // Create new project
  const addProject = async (projectData) => {
    try {
      const response = await createProject(workspaceId, projectData);
      const newProject = response?.project || response;
      setProjects([...projects, newProject]);
      return newProject;
    } catch (err) {
      throw new Error(err.message || 'Failed to create project');
    }
  };

  // Update existing project
  const editProject = async (projectId, projectData) => {
    try {
      const response = await updateProject(workspaceId, projectId, projectData);
      const updated = response?.project || response;
      setProjects(projects.map(p => p.id === projectId ? updated : p));
      return updated;
    } catch (err) {
      throw new Error(err.message || 'Failed to update project');
    }
  };

  // Delete project
  const removeProject = async (projectId) => {
    try {
      await deleteProject(workspaceId, projectId);
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      throw new Error(err.message || 'Failed to delete project');
    }
  };

  return {
    projects,
    loading,
    error,
    fetchProjects,
    addProject,
    editProject,
    removeProject,
  };
};
