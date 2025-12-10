import apiClient from './apiClient';

export const getComments = async (taskId) => {
  const response = await apiClient.get(`/tasks/${taskId}/comments`);
  return response.data;
};

export const createComment = async (taskId, commentData) => {
  const response = await apiClient.post(`/tasks/${taskId}/comments`, commentData);
  return response.data;
};

export const updateComment = async (taskId, commentId, commentData) => {
  const response = await apiClient.put(
    `/tasks/${taskId}/comments/${commentId}`,
    commentData
  );
  return response.data;
};

export const deleteComment = async (taskId, commentId) => {
  const response = await apiClient.delete(
    `/tasks/${taskId}/comments/${commentId}`
  );
  return response.data;
};