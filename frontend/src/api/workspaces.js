import apiClient from "./client";

export const getWorkspaces = async () => {
  const response = await apiClient.get("/workspaces");
  return response.data;
};

export const createWorkspace = async (workspaceData) => {
  const response = await apiClient.post("/workspaces", workspaceData);
  return response.data;
};

export const updateWorkspace = async (workspaceId, workspaceData) => {
  const response = await apiClient.put(`/workspaces/${workspaceId}`, workspaceData);
  return response.data;
};

export const deleteWorkspace = async (workspaceId) => {
  const response = await apiClient.delete(`/workspaces/${workspaceId}`);
  return response.data;
};

export const addWorkspaceMember = async (workspaceId, memberData) => {
  const response = await apiClient.post(
    `/workspaces/${workspaceId}/members`,
    memberData
  );
  return response.data;
};

export const removeWorkspaceMember = async (workspaceId, memberId) => {
  const response = await apiClient.delete(
    `/workspaces/${workspaceId}/members/${memberId}`
  );
  return response.data;
};