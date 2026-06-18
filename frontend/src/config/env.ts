const defaultApiUrl = '/api'

export const env = {
  apiUrl: (import.meta.env.VITE_API_URL ?? import.meta.env.VITE_API_BASE_URL ?? defaultApiUrl).replace(
    /\/$/,
    '',
  ),
}
