import { useState } from 'react';

const CommentForm = ({ onSubmit, initialData = null, onCancel = null }) => {
  const [content, setContent] = useState(initialData?.content || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit({ content });
      setContent('');
      if (onCancel) onCancel();
    } catch (err) {
      setError(err.message || 'Failed to submit comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div>
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError('');
          }}
          placeholder={initialData ? 'Edit your comment...' : 'Add a comment...'}
          rows={3}
          style={{ width: '100%' }}
        />
        {error && <p className="error" style={{ marginTop: '5px' }}>{error}</p>}
      </div>

      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : initialData ? 'Update' : 'Comment'}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
