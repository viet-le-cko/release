import axios from 'axios';
import { chunk } from 'lodash';

export const createCodeDeltaUrls = ({
  githubOwner,
  githubRepo,
  startReleaseTag,
  endReleaseTag,
}: {
  githubOwner: string;
  githubRepo: string;
  startReleaseTag: string;
  endReleaseTag: string;
}) => ({
  api: `https://api.github.com/repos/${githubOwner}/${githubRepo}/compare/${startReleaseTag}...${endReleaseTag}`,
  website: `https://github.com/${githubOwner}/${githubRepo}/compare/${startReleaseTag}...${endReleaseTag}`,
});

export const createPullRequestUrl = ({
  githubOwner,
  githubRepo,
  sha,
}: {
  githubOwner: string;
  githubRepo: string;
  sha: string;
}) => {
  return `https://api.github.com/repos/${githubOwner}/${githubRepo}/commits/${sha}/pulls`;
};

const get = async (url: string, token: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.groot-preview+json',
      },
    });
    return response.data;
  } catch (e) {
    throw new Error(`error getting: ${url} `);
  }
};

export const getCommitsBetweenReleases = async (url: string, token: string) => {
  try {
    const response = await get(url, token);
    return response.commits;
  } catch (e) {
    throw new Error(`error getting: ${url} `);
  }
};

const batchPullRequest = (urls: string[], token: string) => {
  const promises = urls.map(url => get(url, token));

  return Promise.all(promises);
};

export const getPullRequestsMessages = async (
  {
    githubOwner,
    githubRepo,
    shas,
  }: {
    githubOwner: string;
    githubRepo: string;
    shas: string[];
  },
  token: string
) => {
  const pullRequestUrls = shas.map(sha => {
    return createPullRequestUrl({
      githubOwner,
      githubRepo,
      sha,
    });
  });

  const batchPrs = chunk(pullRequestUrls, 15);

  let prMessages: string[] = [];

  for (let prUrls of batchPrs) {
    const prs = await batchPullRequest(prUrls, token);

    for (let pr of prs as any) {
      const body = pr[0].body;
      prMessages = [...prMessages, body];
    }
  }

  return prMessages;
};
