import apiClient from "./client";

export const getTasks = async (workspaceId, projectId) => {
  const response = await apiClient.get(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks`
  );
  return response.data;
};

export const createTask = async (workspaceId, projectId, taskData) => {
  const response = await apiClient.post(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks`,
    taskData
  );
  return response.data;
};

export const updateTask = async (workspaceId, projectId, taskId, taskData) => {
  const response = await apiClient.put(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
    taskData
  );
  return response.data;
};

export const deleteTask = async (workspaceId, projectId, taskId) => {
  const response = await apiClient.delete(
    `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
  );
  return response.data;
};
