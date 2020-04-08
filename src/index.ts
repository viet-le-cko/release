import axios from 'axios';

const getCommitsBetweenReleases = async (start: string, end: string) => {
  const response = await axios.get(
    `https://api.github.com/repos/viet-le-cko/release-test/compare/${start}...${end}`
  );
  return response.data.commits;
};

(async () => {
  const commits = await getCommitsBetweenReleases(
    'build-number-1111',
    'build-number-5555'
  );

  const jiraTicketRegex = new RegExp(/(^PRISM-\d*)/);

  console.log(
    commits
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
      })
  );

  return null;
})();
