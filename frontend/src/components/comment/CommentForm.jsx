import { useState } from 'react';
import Button from '../common/Button';

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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError('');
          }}
          placeholder={initialData ? 'Edit your comment...' : 'Add a comment...'}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
      </div>

      <div className="flex gap-2 justify-end">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="secondary"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : initialData ? 'Update' : 'Comment'}
        </Button>
      </div>
    </form>
  );
};

export default CommentForm;
