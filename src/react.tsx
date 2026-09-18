import { useCallback, useEffect, useMemo, useState } from 'react';
import { DiscussionsClient } from './client';
import type { DiscussionComment, DiscussionsConfig, TargetType } from './types';
export { DiscussionThread } from './react-components/DiscussionThread';
export { CommentItem } from './react-components/CommentItem';
export { CommentInput } from './react-components/CommentInput';
export type { DiscussionTheme } from './react-components/theme';

export function useDiscussion(
  clientOrConfig: DiscussionsClient | DiscussionsConfig,
  targetType: TargetType | string,
  targetId?: string,
) {
  const client = useMemo(
    () => (clientOrConfig instanceof DiscussionsClient ? clientOrConfig : new DiscussionsClient(clientOrConfig)),
    [clientOrConfig],
  );
  const [comments, setComments] = useState<DiscussionComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!targetId) return;
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    void client.listComments(targetType, targetId).then((result) => {
      if (cancelled) return;
      if (result.data) setComments(result.data);
      if (result.error) setError(result.error.message);
      setIsLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [client, targetType, targetId]);

  const addComment = useCallback(
    async (
      body: string,
      options?: { parentCommentId?: string; authorName?: string; authorEmail?: string },
    ) => {
      if (!targetId) return;
      const result = await client.addComment(targetType, targetId, {
        body,
        parent_comment_id: options?.parentCommentId,
        author_name: options?.authorName,
        author_email: options?.authorEmail,
      });
      if (result.error) {
        setError(result.error.message);
        return result;
      }
      if (result.data) {
        setComments((prev) => (prev.some((c) => c.id === result.data!.id) ? prev : [...prev, result.data!]));
      }
      return result;
    },
    [client, targetType, targetId],
  );

  return { comments, isLoading, error, addComment, client };
}
