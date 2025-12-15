import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContextDefinition';
import CommentForm from './CommentForm';
import { useToast } from '../../context/ToastContext';

const CommentList = ({ comments, loading, onEdit, onDelete }) => {
  const { user } = useContext(AuthContext);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const toast = useToast();

  const handleEdit = async (commentId, commentData) => {
    try {
      await onEdit(commentId, commentData);
      setEditingCommentId(null);
      toast.success('Comment updated successfully');
    } catch (error) {
      console.error('Failed to edit comment:', error);
      toast.error('Failed to edit comment: ' + error.message);
    }
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await onDelete(commentId);
      toast.success('Comment deleted successfully');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      toast.error('Failed to delete comment: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  if (loading) {
    return <div style={{ color: '#666' }}>Loading comments...</div>;
  }

  if (comments.length === 0) {
    return <div style={{ color: '#999', textAlign: 'center', padding: '15px' }}>No comments yet. Be the first to comment!</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {comments.map(comment => (
        <div key={comment.id} className="card">
          {editingCommentId === comment.id ? (
            <CommentForm
              onSubmit={(data) => handleEdit(comment.id, data)}
              initialData={comment}
              onCancel={() => setEditingCommentId(null)}
            />
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <p style={{ fontWeight: '500', margin: 0 }}>
                    {comment.author?.email || 'Unknown User'}
                  </p>
                  <p style={{ fontSize: '12px', color: '#666', margin: '2px 0 0 0' }}>
                    {formatDate(comment.createdAt)}
                    {comment.updatedAt !== comment.createdAt && ' (edited)'}
                  </p>
                </div>

                {user && comment.author && user.id === comment.author.id && (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => setEditingCommentId(comment.id)}
                      style={{ fontSize: '14px' }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      style={{ fontSize: '14px', color: '#d32f2f' }}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <p style={{ margin: 0, color: '#333' }}>{comment.content}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
