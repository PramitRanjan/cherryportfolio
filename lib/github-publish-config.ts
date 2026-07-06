export const DEFAULT_GITHUB_REPO_OWNER = 'PramitRanjan';
export const DEFAULT_GITHUB_REPO_NAME = 'cherryportfolio';
export const DEFAULT_GITHUB_CONTENT_BRANCH = 'main';
export const DEFAULT_GITHUB_CONTENT_PATH = 'content/site-content.json';

export function resolveGitHubPublishConfig(env: Record<string, string | undefined> = process.env) {
  return {
    token: env.GITHUB_TOKEN,
    owner: env.GITHUB_REPO_OWNER || DEFAULT_GITHUB_REPO_OWNER,
    repo: env.GITHUB_REPO_NAME || DEFAULT_GITHUB_REPO_NAME,
    branch: env.GITHUB_CONTENT_BRANCH || DEFAULT_GITHUB_CONTENT_BRANCH,
    path: env.GITHUB_CONTENT_PATH || DEFAULT_GITHUB_CONTENT_PATH,
  };
}

export function isGitHubDashboardPublishConfigured(env: Record<string, string | undefined> = process.env): boolean {
  return Boolean(resolveGitHubPublishConfig(env).token);
}
