import { useState } from 'react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { FiHeart, FiCornerDownRight, FiTrash2, FiEdit2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { commentApi } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { timeAgo } from '../../utils/formatters';

const CommentItem = ({ comment, blogId, replies, onReply }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const likeMutation = useMutation({
    mutationFn: () => commentApi.toggleLike(comment._id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['comments', blogId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: () => commentApi.remove(comment._id),
    onSuccess: () => {
      toast.success('Comment deleted');
      queryClient.invalidateQueries({ queryKey: ['comments', blogId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: () => commentApi.update(comment._id, editContent),
    onSuccess: () => {
      toast.success('Comment updated');
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ['comments', blogId] });
    },
  });

  const isOwner = user && user._id === comment.author?._id;
  const hasLiked = user && comment.likes?.includes(user._id);

  return (
    <div className="flex gap-3">
      {comment.author?.avatar?.url ? (
        <img src={comment.author.avatar.url} alt={comment.author.name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
      ) : (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-bold">
          {comment.author?.name?.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="flex-1">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">{comment.author?.name}</p>
            <p className="text-xs text-slate-400">{timeAgo(comment.createdAt)}{comment.isEdited && ' · edited'}</p>
          </div>
          {editing ? (
            <div className="mt-2">
              <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} rows={2} className="input-field" />
              <div className="mt-2 flex gap-2">
                <button onClick={() => updateMutation.mutate()} className="btn-primary !px-3 !py-1.5 text-xs">Save</button>
                <button onClick={() => setEditing(false)} className="btn-secondary !px-3 !py-1.5 text-xs">Cancel</button>
              </div>
            </div>
          ) : (
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">{comment.content}</p>
          )}
        </div>

        <div className="mt-2 flex items-center gap-4 px-1 text-xs text-slate-500">
          <button onClick={() => likeMutation.mutate()} className={`flex items-center gap-1 hover:text-danger ${hasLiked ? 'text-danger' : ''}`}>
            <FiHeart className={hasLiked ? 'fill-current' : ''} /> {comment.likes?.length || 0}
          </button>
          <button onClick={() => onReply(comment)} className="flex items-center gap-1 hover:text-primary">
            <FiCornerDownRight /> Reply
          </button>
          {isOwner && (
            <>
              <button onClick={() => setEditing(true)} className="flex items-center gap-1 hover:text-primary"><FiEdit2 /> Edit</button>
              <button onClick={() => deleteMutation.mutate()} className="flex items-center gap-1 hover:text-danger"><FiTrash2 /> Delete</button>
            </>
          )}
        </div>

        {replies?.length > 0 && (
          <div className="mt-3 space-y-3 border-l-2 border-slate-100 dark:border-slate-700 pl-4">
            {replies.map((reply) => (
              <CommentItem key={reply._id} comment={reply} blogId={blogId} replies={[]} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CommentSection = ({ blogId }) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['comments', blogId],
    queryFn: () => commentApi.getByBlog(blogId),
    enabled: !!blogId,
  });

  const comments = data?.data?.data?.comments || [];
  const topLevel = comments.filter((c) => !c.parentComment);
  const repliesMap = comments.reduce((acc, c) => {
    if (c.parentComment) {
      acc[c.parentComment] = acc[c.parentComment] || [];
      acc[c.parentComment].push(c);
    }
    return acc;
  }, {});

  const createMutation = useMutation({
    mutationFn: () => commentApi.create(blogId, { content, parentComment: replyTo?._id || null }),
    onSuccess: () => {
      setContent('');
      setReplyTo(null);
      queryClient.invalidateQueries({ queryKey: ['comments', blogId] });
      toast.success('Comment posted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to post comment'),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    createMutation.mutate();
  };

  return (
    <section className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-10">
      <h3 className="text-xl font-bold mb-6">Comments ({comments.length})</h3>

      {isAuthenticated ? (
        <form onSubmit={handleSubmit} className="mb-8">
          {replyTo && (
            <div className="mb-2 flex items-center justify-between rounded-lg bg-primary/5 px-3 py-2 text-xs text-primary">
              Replying to {replyTo.author?.name}
              <button type="button" onClick={() => setReplyTo(null)} className="font-semibold">Cancel</button>
            </div>
          )}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="input-field"
          />
          <button disabled={createMutation.isPending} className="btn-primary mt-3 !px-5 !py-2 text-sm">
            Post Comment
          </button>
        </form>
      ) : (
        <p className="mb-8 rounded-xl bg-slate-50 dark:bg-white/5 p-4 text-sm text-slate-500">
          Please log in to join the conversation.
        </p>
      )}

      {isLoading ? (
        <p className="text-sm text-slate-400">Loading comments...</p>
      ) : (
        <div className="space-y-6">
          {topLevel.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              blogId={blogId}
              replies={repliesMap[comment._id] || []}
              onReply={(c) => setReplyTo(c)}
            />
          ))}
          {topLevel.length === 0 && <p className="text-sm text-slate-400">Be the first to comment.</p>}
        </div>
      )}
    </section>
  );
};

export default CommentSection;
