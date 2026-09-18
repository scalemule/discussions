# @scalemule/discussions

Threaded comments for any ScaleMule object: blog posts, news articles, photos, videos, listings, or pages.

```bash
npm install @scalemule/discussions
```

Talks to `scalemule-discussions` at `/v1/discussions`. Do not put an internal service token in the browser. Customer apps use `SCALEMULE_API_KEY` (or a same-origin BFF that holds that key).

```tsx
import { DiscussionsClient } from '@scalemule/discussions';
import { DiscussionThread, useDiscussion } from '@scalemule/discussions/react';

const client = new DiscussionsClient({
  apiKey: process.env.NEXT_PUBLIC_SCALEMULE_API_KEY,
});

function Comments({ articleId }: { articleId: string }) {
  const { comments, addComment } = useDiscussion(client, 'blog_post', articleId);
  return (
    <DiscussionThread
      comments={comments}
      onAddComment={(body, parentId, guest) =>
        addComment(body, { parentCommentId: parentId, ...guest })
      }
    />
  );
}
```

Same-origin proxy (Napsite news sites): set `apiBaseUrl` to `''` and `pathPrefix` to `/api/discussions` so the browser never sees the API key.

Target types: `blog_post`, `photo`, `video`, `audio`, `listing`, `page`, `social_post`.
