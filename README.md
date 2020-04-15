# Release Automation

Running this project will automatically generate the code and functional delta to create a Jira release ticket - https://checkout.atlassian.net/secure/RapidBoard.jspa?rapidView=122

### Prerequisite
- `export GITHUB_TOKEN=<github_personal_access_token>` 

### Getting started

- `yarn`
- `yarn build && node dist/index.js`
