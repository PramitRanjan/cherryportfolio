import 'server-only';

/** Commits the full content JSON to GitHub, triggering a Vercel redeploy. */
export async function commitContentToGitHub(json: string): Promise<void> {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const token = process.env.GITHUB_TOKEN;
  const path = process.env.GITHUB_CONTENT_PATH || 'content/site-content.json';
  const branch = process.env.GITHUB_CONTENT_BRANCH || 'main';

  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  const getRes = await fetch(`${url}?ref=${branch}`, { headers, cache: 'no-store' });

  let sha: string | undefined;
  if (getRes.status === 404) {
    sha = undefined;
  } else if (!getRes.ok) {
    throw new Error(`GitHub content lookup failed: ${getRes.status} ${await getRes.text()}`);
  } else {
    const body = (await getRes.json()) as { sha?: string };
    sha = body.sha;
  }

  const putRes = await fetch(url, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: 'content: update via dashboard',
      content: Buffer.from(json).toString('base64'),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!putRes.ok) {
    throw new Error(`GitHub commit failed: ${putRes.status} ${await putRes.text()}`);
  }
}
