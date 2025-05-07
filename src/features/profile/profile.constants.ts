export const PROFILE_KEY = 'profile';
export const PROFILE_COOKIE_VALUE = 'true';
export const PROFILE_QUERY_KEY = [PROFILE_KEY] as const;
export const PROFILE_QUERY_PATH = '/api/auth/me';
export const PROFILE_STALE_TIME = 15 * 60 * 1000;

export const TOKEN_KEY = 'token';
export const LOGOUT_QUERY_KEY = ['logout'] as const;
