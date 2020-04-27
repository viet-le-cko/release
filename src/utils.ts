const jiraRegex = /((?!([A-Z0-9a-z]{1,10})-?$)[A-Z]{1}[A-Z0-9]+-\d+)/gm;

export const getFunctionalDelta = (commits: any) => {
  let tickets: string[] = [];

  commits
    .map(({ commit }: any) => {
      return commit.message;
    })
    .filter((message: string) => {
      return jiraRegex.test(message);
    })
    .forEach((message: string) => {
      const ticketMatches = message.match(jiraRegex);

      if (ticketMatches !== null) {
        tickets = [...tickets, ...ticketMatches];
      }
    });

  return Array.from(new Set(tickets));
};

export const printOut = (codeDelta: string, functionalDelta: string) => {
  console.log(`
*Code Delta*
${codeDelta}

*Functional Delta*
${functionalDelta}
`);
};
