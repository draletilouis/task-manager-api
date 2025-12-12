import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContextDefinition';
import CommentForm from './CommentForm';
import Button from '../common/Button';

const CommentList = ({ comments, loading, onEdit, onDelete }) => {
  const { user } = useContext(AuthContext);
  const [editingCommentId, setEditingCommentId] = useState(null);

  const handleEdit = async (commentId, commentData) => {
    try {
      await onEdit(commentId, commentData);
      setEditingCommentId(null);
    } catch (error) {
      console.error('Failed to edit comment:', error);
      alert('Failed to edit comment: ' + error.message);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await onDelete(commentId);
    } catch (error) {
      console.error('Failed to delete comment:', error);
      alert('Failed to delete comment: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return <div className="text-gray-500">Loading comments...</div>;
  }

  if (comments.length === 0) {
    return <div className="text-gray-400 text-center py-4">No comments yet. Be the first to comment!</div>;
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
          {editingCommentId === comment.id ? (
            <CommentForm
              onSubmit={(data) => handleEdit(comment.id, data)}
              initialData={comment}
              onCancel={() => setEditingCommentId(null)}
            />
          ) : (
            <>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">
                    {comment.author?.email || 'Unknown User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(comment.createdAt)}
                    {comment.updatedAt !== comment.createdAt && ' (edited)'}
                  </p>
                </div>

                {user && comment.author && user.id === comment.author.id && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCommentId(comment.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <p className="text-gray-700">{comment.content}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
