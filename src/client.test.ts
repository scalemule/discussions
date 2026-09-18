import { describe, expect, it } from 'vitest';
import { DiscussionsClient } from './client';

describe('DiscussionsClient', () => {
  it('builds the public discussions path', () => {
    const client = new DiscussionsClient();
    expect(client.threadPath('blog_post', 'abc-123')).toBe(
      '/v1/discussions/threads/blog_post/abc-123/comments',
    );
  });

  it('uses a same-origin BFF prefix without an API origin', () => {
    const client = new DiscussionsClient({ apiBaseUrl: '', pathPrefix: '/api/discussions' });
    expect(client.threadPath('photo', 'img-1')).toBe('/api/discussions/threads/photo/img-1/comments');
  });

  it('encodes target ids', () => {
    const client = new DiscussionsClient();
    expect(client.threadPath('page', 'a/b')).toBe('/v1/discussions/threads/page/a%2Fb/comments');
  });
});
