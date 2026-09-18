import React from 'react';
import type { DiscussionComment } from '../types';
import type { DiscussionTheme } from './theme';
import { themeToStyle } from './theme';

interface CommentItemProps {
  comment: DiscussionComment;
  depth?: number;
  onReply?: (parentId: string) => void;
  theme?: DiscussionTheme;
}

const MAX_INDENT = 4;

export function CommentItem({ comment, depth = 0, onReply, theme }: CommentItemProps): React.JSX.Element {
  const indent = Math.min(depth, MAX_INDENT);
  const replies = comment.replies ?? [];
  return (
    <div
      style={{
        ...themeToStyle(theme),
        marginLeft: indent * 24,
        paddingLeft: depth > 0 ? 16 : 0,
        borderLeft: depth > 0 ? '2px solid var(--sm-d-border, #d7dcd7)' : 'none',
        marginTop: 16,
        fontFamily: 'var(--sm-d-font, Arial, sans-serif)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--sm-d-text)' }}>
          {comment.author_name ?? 'A reader'}
        </span>
        <time dateTime={comment.created_at} style={{ fontSize: 12, color: 'var(--sm-d-muted)' }}>
          {new Date(comment.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </time>
        {comment.status === 'pending' && (
          <span style={{ fontSize: 11, padding: '1px 6px', background: '#fef3c7', color: '#92400e' }}>Pending review</span>
        )}
      </div>
      <div style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--sm-d-text)', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {comment.body}
      </div>
      {onReply && comment.status !== 'pending' && (
        <button
          type="button"
          onClick={() => onReply(comment.id)}
          style={{ border: 'none', background: 'transparent', color: 'var(--sm-d-muted)', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit' }}
        >
          Reply
        </button>
      )}
      {replies.map((child) => (
        <CommentItem key={child.id} comment={child} depth={depth + 1} onReply={onReply} theme={theme} />
      ))}
    </div>
  );
}
