import fs from 'fs';
import path from 'path';

interface Config {
  githubRepo: string;
  githubOwner: string;
  jiraTicketPrefix: string;
}

export default async function() {
  return new Promise<Config>((resolve, reject) => {
    const releaseFilePath = path.resolve(process.cwd(), '.release');

    try {
      if (fs.existsSync(releaseFilePath)) {
        fs.readFile(releaseFilePath, 'UTF-8', (err, data) => {
          if (err) throw err;

          const config = JSON.parse(data);

          resolve({
            githubRepo: config['github-repo'],
            githubOwner: config['github-owner'],
            jiraTicketPrefix: config['jira-ticket-prefix'],
          });
        });
      } else {
        reject('no .release file found');
      }
    } catch {}
  });
}
