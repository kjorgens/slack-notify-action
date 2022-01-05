const core = require('@actions/core');
const github = require('@actions/github');
const superAgent = require('superagent');

(async () => {

  try {
    const payload = JSON.stringify(github.context.payload, undefined, 2);
    console.log(payload);

    let repoName;
    let prNumber;
    let repoOwner;
    let serviceUrl;
    let messageType;
    let messageBody;
    let slackRecipient;

    if (github.context.payload.action === 'created' && github.context.payload.comment !== undefined) {
      commentString = github.context.payload.comment.body;
      repoName = github.context.payload.repository.name;
      prNumber = github.context.payload.issue.number;
      repoOwner = github.context.payload.organization.login;
      serviceUrl = core.getInput('service-url');
      messageType = core.getInput('message-type') || 'slack_direct_message';
      messageBody = core.getInput('message-body') || 'slack message body';
      slackRecipient = core.getInput('slack-recipient-github-user') || github.context.payload.user.login;

      try {
        // return await Promise.all(
        //   notifyList.map(async (user) => {
            return superAgent.post(serviceUrl)
              .set('Content-Type', 'application/json')
              .send({
                body: messageBody,
                message_type: messageType,
                icon_emoji: ':chomp:',
                bot_user_name: 'testing bot',
                github_user_name: slackRecipient,
                spam_timeout: 0,
                // blocks: msgBlocks
              });
          // }))
      } catch (err) {
        console.log(err.message);
        return process.exit(1);
      }
    }
  } catch (error) {
    core.setFailed(error.message);
    process.exit(1);
  }
})();
