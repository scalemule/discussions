import React, { useCallback, useState } from 'react';
import type { DiscussionComment } from '../types';
import type { DiscussionTheme } from './theme';
import { themeToStyle } from './theme';
import { CommentItem } from './CommentItem';
import { CommentInput } from './CommentInput';

interface DiscussionThreadProps {
  comments: DiscussionComment[];
  onAddComment?: (
    content: string,
    parentId?: string,
    guest?: { authorName?: string; authorEmail?: string },
  ) => void | Promise<void>;
  currentUserId?: string;
  allowGuestComments?: boolean;
  theme?: DiscussionTheme;
  title?: string;
  error?: string | null;
}

function buildTree(comments: DiscussionComment[]): DiscussionComment[] {
  const byId = new Map<string, DiscussionComment & { replies: DiscussionComment[] }>();
  const roots: (DiscussionComment & { replies: DiscussionComment[] })[] = [];
  for (const comment of comments) {
    byId.set(comment.id, { ...comment, replies: [] });
  }
  for (const comment of comments) {
    const node = byId.get(comment.id)!;
    if (comment.parent_comment_id && byId.has(comment.parent_comment_id)) {
      byId.get(comment.parent_comment_id)!.replies.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export function DiscussionThread({
  comments,
  onAddComment,
  currentUserId,
  allowGuestComments = true,
  theme,
  title = 'Comments',
  error,
}: DiscussionThreadProps): React.JSX.Element {
  const [replyingTo, setReplyingTo] = useState<string | undefined>();
  const tree = buildTree(comments);
  const isGuest = !currentUserId;

  const handleAdd = useCallback(
    async (content: string, guestName?: string, guestEmail?: string) => {
      if (!onAddComment) return;
      await onAddComment(content, replyingTo, { authorName: guestName, authorEmail: guestEmail });
      setReplyingTo(undefined);
    },
    [onAddComment, replyingTo],
  );

  return (
    <section
      aria-label={title}
      style={{ ...themeToStyle(theme), fontFamily: 'var(--sm-d-font, Arial, sans-serif)', marginTop: 36 }}
    >
      <h2
        style={{
          margin: '0 0 16px',
          fontSize: 28,
          fontWeight: 700,
          fontFamily: 'var(--sm-d-heading-font, Georgia, serif)',
          color: 'var(--sm-d-heading)',
        }}
      >
        {title} ({comments.length})
      </h2>
      {error && <p style={{ color: 'var(--sm-d-primary)', fontSize: 14 }}>{error}</p>}
      {tree.length === 0 ? (
        <p style={{ color: 'var(--sm-d-muted)', fontSize: 15, padding: '8px 0 16px' }}>
          No comments yet. Be the first to share a thought on this story.
        </p>
      ) : (
        tree.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            depth={0}
            onReply={onAddComment ? setReplyingTo : undefined}
            theme={theme}
          />
        ))
      )}
      {onAddComment && (
        <div style={{ marginTop: 24 }}>
          <CommentInput
            onSubmit={handleAdd}
            showGuestFields={isGuest && allowGuestComments}
            replyingTo={replyingTo}
            onCancelReply={replyingTo ? () => setReplyingTo(undefined) : undefined}
            theme={theme}
          />
        </div>
      )}
    </section>
  );
}
