import axios from 'axios';
import prompts from 'prompts';
import loadDotFile from './loadDotFile';
import { getFunctionalDelta } from './utils';

// CLI
const questions = [
  {
    type: 'text',
    name: 'startReleaseTag',
    message: 'What is the release tag you want to start from?',
  },
  {
    type: 'text',
    name: 'endReleaseTag',
    message: 'What is the release tag you want to end to?',
  },
];

const createCodeDeltaUrls = ({
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

// Get request
const getCommitsBetweenReleases = async (url: string, token: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `token ${token}`,
      },
    });
    return response.data.commits;
  } catch {
    throw new Error(`error getting: ${url} `);
  }
};

(async () => {
  const { githubOwner, githubRepo, jiraTicketPrefix } = await loadDotFile();

  const { startReleaseTag, endReleaseTag } = await prompts(questions as any);

  const githubUrls = createCodeDeltaUrls({
    githubOwner,
    githubRepo,
    startReleaseTag,
    endReleaseTag,
  });

  try {
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

    if (!GITHUB_TOKEN) {
      throw new Error('No GitHub token provided');
    }

    const commits = await getCommitsBetweenReleases(
      githubUrls.api,
      GITHUB_TOKEN
    );

    const jiraTicketRegex = new RegExp(`(^${jiraTicketPrefix}-\\d*)`);

    const functialDelta = getFunctionalDelta(commits, jiraTicketRegex);

    console.log(`
  *Code Delta*
  ${githubUrls.website}
  
  *Functional Delta*
  ${functialDelta.join('\n  ')}
  `);
  } catch (e) {
    console.log(e.message);
  }

  return null;
})();
