export type TargetType =
  | 'blog_post'
  | 'photo'
  | 'video'
  | 'audio'
  | 'listing'
  | 'page'
  | 'social_post';

export interface DiscussionsConfig {
  apiKey?: string;
  /** Origin of the API, no trailing slash. Default https://api.scalemule.com */
  apiBaseUrl?: string;
  /** Path before /threads/.... Default /v1/discussions */
  pathPrefix?: string;
  getToken?: () => Promise<string | null>;
  sessionToken?: string;
  userId?: string;
}

export interface ApiError {
  code: string;
  message: string;
  status?: number;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}

export type CommentStatus = 'pending' | 'approved' | 'spam' | 'deleted';

export interface DiscussionComment {
  id: string;
  thread_id?: string;
  target_type?: string;
  target_id?: string;
  author_user_id?: string | null;
  author_name?: string | null;
  author_email?: string | null;
  parent_comment_id?: string | null;
  body: string;
  status: CommentStatus | string;
  depth?: number;
  created_at: string;
  updated_at: string;
  replies?: DiscussionComment[];
}

export interface AddCommentOptions {
  body: string;
  parent_comment_id?: string;
  author_name?: string;
  author_email?: string;
}

export interface ListCommentsOptions {
  page?: number;
  per_page?: number;
  since?: string;
}
