export const getFunctionalDelta = (commits: any, jiraTicketRegex: RegExp) => {
  const delta = commits
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

  return Array.from(new Set(delta));
};
