import fs from 'fs';
import path from 'path';
import prompts from 'prompts';

interface Config {
  githubRepo: string;
  githubOwner: string;
}

const questions = [
  {
    type: 'text',
    name: 'githubRepo',
    message: 'What is the github repo?',
  },
  {
    type: 'text',
    name: 'githubOwner',
    message: 'Who is the github owner?',
  },
];

export default async function() {
  return new Promise<Config>(async (resolve, reject) => {
    const releaseFilePath = path.resolve(process.cwd(), '.release');

    try {
      if (fs.existsSync(releaseFilePath)) {
        fs.readFile(releaseFilePath, 'UTF-8', (err, data) => {
          if (err) throw err;

          const config = JSON.parse(data);

          resolve({
            githubRepo: config['github-repo'],
            githubOwner: config['github-owner'],
          });
        });
      } else {
        // we are going to create one using prompts

        const { githubRepo, githubOwner } = await prompts(questions as any);

        const config = {
          'github-repo': githubRepo,
          'github-owner': githubOwner,
        };

        fs.writeFile(releaseFilePath, JSON.stringify(config), function(err) {
          if (err) {
            return reject(err);
          }

          console.log('created .release file, dont forget to commit it ;)');

          resolve({
            githubRepo: config['github-repo'],
            githubOwner: config['github-owner'],
          });
        });
      }
    } catch {}
  });
}
