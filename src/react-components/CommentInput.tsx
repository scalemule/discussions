import React, { useCallback, useState } from 'react';
import type { DiscussionTheme } from './theme';
import { themeToStyle } from './theme';

interface CommentInputProps {
  onSubmit: (content: string, guestName?: string, guestEmail?: string) => void | Promise<void>;
  showGuestFields?: boolean;
  replyingTo?: string;
  onCancelReply?: () => void;
  theme?: DiscussionTheme;
}

export function CommentInput({
  onSubmit,
  showGuestFields = false,
  replyingTo,
  onCancelReply,
  theme,
}: CommentInputProps): React.JSX.Element {
  const [content, setContent] = useState('');
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(
        trimmed,
        showGuestFields ? guestName.trim() || undefined : undefined,
        showGuestFields ? guestEmail.trim() || undefined : undefined,
      );
      setContent('');
    } finally {
      setIsSubmitting(false);
    }
  }, [content, guestName, guestEmail, showGuestFields, isSubmitting, onSubmit]);

  const inputStyle: React.CSSProperties = {
    width: '100%',
    fontSize: 16,
    border: '1px solid var(--sm-d-border, #d7dcd7)',
    borderRadius: 'var(--sm-d-radius, 0)',
    padding: '10px 12px',
    fontFamily: 'var(--sm-d-font, Arial, sans-serif)',
    color: 'var(--sm-d-text, #171917)',
    background: 'var(--sm-d-surface, #ffffff)',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ ...themeToStyle(theme), fontFamily: 'var(--sm-d-font, Arial, sans-serif)' }}>
      {replyingTo && (
        <div style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--sm-d-muted)', marginBottom: 8 }}>
          <span>Replying</span>
          {onCancelReply && (
            <button type="button" onClick={onCancelReply} style={{ border: 'none', background: 'transparent', color: 'var(--sm-d-primary)', cursor: 'pointer', padding: 0 }}>
              Cancel
            </button>
          )}
        </div>
      )}
      {showGuestFields && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input type="text" placeholder="Name" value={guestName} onChange={(e) => setGuestName(e.target.value)} style={{ ...inputStyle, flex: 1 }} aria-label="Your name" />
          <input type="email" placeholder="Email (optional)" value={guestEmail} onChange={(e) => setGuestEmail(e.target.value)} style={{ ...inputStyle, flex: 1 }} aria-label="Your email" />
        </div>
      )}
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          style={{ ...inputStyle, flex: 1, resize: 'vertical', minHeight: 80 }}
          aria-label="Comment"
        />
        <button
          type="button"
          onClick={() => void handleSubmit()}
          disabled={!content.trim() || isSubmitting || (showGuestFields && !guestName.trim())}
          style={{
            border: '1px solid var(--sm-d-primary, #bb171d)',
            padding: '10px 20px',
            minHeight: 44,
            background: 'var(--sm-d-primary, #bb171d)',
            color: 'var(--sm-d-primary-text, #ffffff)',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            opacity: !content.trim() || isSubmitting ? 0.5 : 1,
            fontFamily: 'inherit',
          }}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
}
