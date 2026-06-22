import 'server-only';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const ctEnv = {
  projectKey: requireEnv('CT_PROJECT_KEY'),
  clientId: requireEnv('CT_CLIENT_ID'),
  clientSecret: requireEnv('CT_CLIENT_SECRET'),
  apiUrl: requireEnv('CT_API_URL'),
  authUrl: requireEnv('CT_AUTH_URL'),
  scopes: process.env.CT_SCOPES ?? '',
} as const;
