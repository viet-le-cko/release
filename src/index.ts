import axios from 'axios';
import prompts from 'prompts';
import loadDotFile from './loadDotFile';

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

const createCodeDeltaUrl = ({
  githubOwner,
  githubRepo,
  startReleaseTag,
  endReleaseTag,
}: {
  githubOwner: string;
  githubRepo: string;
  startReleaseTag: string;
  endReleaseTag: string;
}) =>
  `https://api.github.com/repos/${githubOwner}/${githubRepo}/compare/${startReleaseTag}...${endReleaseTag}`;

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

  const codeDeltaUrl = createCodeDeltaUrl({
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

    const commits = await getCommitsBetweenReleases(codeDeltaUrl, GITHUB_TOKEN);

    const jiraTicketRegex = new RegExp(`(^${jiraTicketPrefix}-\\d*)`);

    const functialDelta = commits
      .map(({ commit }: any) => {
        return commit.message;
      })
      .filter((message: string) => {
        return jiraTicketRegex.test(message);
      })
      .map((message: string) => {
        const prismCommits = message.match(jiraTicketRegex);
        if (prismCommits !== null) {
          return prismCommits[0];
        }
        return message;
      });

    console.log(`
  *Code Delta*
  ${codeDeltaUrl}
  
  *Functional Delta*
  ${functialDelta.join('\n  ')}
  `);
  } catch (e) {
    console.log(e.message);
  }

  return null;
})();
