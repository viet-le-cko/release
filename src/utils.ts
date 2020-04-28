const jiraRegex = /((?!([A-Z0-9a-z]{1,10})-?$)[A-Z]{1}[A-Z0-9]+-\d+)/gm;

export const getFunctionalDelta = (messages: string[]) => {
  let tickets: string[] = [];

  messages
    .filter((message: string) => {
      return message.match(jiraRegex) !== null;
    })
    .forEach((message: string) => {
      const ticketMatches = message.match(jiraRegex);
      jiraRegex.lastIndex = 0;

      if (ticketMatches !== null) {
        tickets = [...tickets, ...ticketMatches];
      }
    });

  return Array.from(new Set(tickets.filter(ticket => ticket)));
};

export const printOut = (codeDelta: string, functionalDelta: string) => {
  console.log(`
*Code Delta*
${codeDelta}

*Functional Delta*
${functionalDelta}
`);
};

export const getShas = (commits: any) => {
  return commits.map((commit: any) => commit.sha);
};
