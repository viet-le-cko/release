import prompts from 'prompts';
import loadDotFile from './loadDotFile';
import { getFunctionalDelta, printOut, getShas } from './utils';
import {
  createCodeDeltaUrls,
  getCommitsBetweenReleases,
  getPullRequestsMessages,
} from './github';

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

(async () => {
  const { githubOwner, githubRepo } = await loadDotFile();

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

    const shas = getShas(commits);

    const messages = await getPullRequestsMessages(
      { githubOwner, githubRepo, shas },
      GITHUB_TOKEN
    );

    const functialDelta = getFunctionalDelta(messages);

    printOut(githubUrls.website, functialDelta.join('\n'));
  } catch (e) {
    console.log(e.message);
  }

  return null;
})();
