import type {
  AddCommentOptions,
  ApiError,
  ApiResponse,
  DiscussionComment,
  DiscussionsConfig,
  ListCommentsOptions,
  TargetType,
} from './types';

const DEFAULT_BASE = 'https://api.scalemule.com';
const DEFAULT_PREFIX = '/v1/discussions';

export class DiscussionsClient {
  private readonly apiKey?: string;
  private readonly baseUrl: string;
  private readonly prefix: string;
  private readonly getToken?: () => Promise<string | null>;

  constructor(config: DiscussionsConfig = {}) {
    this.apiKey = config.apiKey;
    this.baseUrl = (config.apiBaseUrl ?? DEFAULT_BASE).replace(/\/$/, '');
    this.prefix = (config.pathPrefix ?? DEFAULT_PREFIX).replace(/\/$/, '') || '';
    this.getToken =
      config.getToken ??
      (config.sessionToken ? async () => config.sessionToken ?? null : undefined);
  }

  threadPath(targetType: TargetType | string, targetId: string): string {
    return `${this.prefix}/threads/${encodeURIComponent(targetType)}/${encodeURIComponent(targetId)}/comments`;
  }

  async listComments(
    targetType: TargetType | string,
    targetId: string,
    options?: ListCommentsOptions,
  ): Promise<ApiResponse<DiscussionComment[]>> {
    const params = new URLSearchParams();
    if (options?.page) params.set('page', String(options.page));
    if (options?.per_page) params.set('per_page', String(options.per_page));
    if (options?.since) params.set('since', options.since);
    const qs = params.toString();
    return this.request<DiscussionComment[]>(
      'GET',
      `${this.threadPath(targetType, targetId)}${qs ? `?${qs}` : ''}`,
    );
  }

  async addComment(
    targetType: TargetType | string,
    targetId: string,
    options: AddCommentOptions,
  ): Promise<ApiResponse<DiscussionComment>> {
    return this.request<DiscussionComment>('POST', this.threadPath(targetType, targetId), {
      content: options.body,
      body: options.body,
      parent_comment_id: options.parent_comment_id,
      author_name: options.author_name,
      author_email: options.author_email,
    });
  }

  async editComment(commentId: string, body: string): Promise<ApiResponse<DiscussionComment>> {
    return this.request<DiscussionComment>(
      'PATCH',
      `${this.prefix}/comments/${encodeURIComponent(commentId)}`,
      { content: body, body },
    );
  }

  async deleteComment(commentId: string): Promise<ApiResponse<void>> {
    return this.request<void>('DELETE', `${this.prefix}/comments/${encodeURIComponent(commentId)}`);
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.apiKey) headers['x-api-key'] = this.apiKey;
    if (this.getToken) {
      const token = await this.getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    try {
      const response = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        credentials: !this.baseUrl || this.baseUrl.startsWith('/') ? 'same-origin' : 'omit',
      });
      if (response.status === 204) return { data: null, error: null };
      const json = await response.json().catch(() => null);
      if (!response.ok) {
        const error: ApiError = {
          code: json?.error?.code ?? 'unknown',
          message: json?.error?.message ?? json?.error ?? json?.message ?? response.statusText,
          status: response.status,
        };
        return { data: null, error };
      }
      const data = json?.data !== undefined ? json.data : json;
      return { data: data as T, error: null };
    } catch (err) {
      return {
        data: null,
        error: {
          code: 'network_error',
          message: err instanceof Error ? err.message : 'Network error',
          status: 0,
        },
      };
    }
  }
}
