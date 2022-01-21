const core = require('@actions/core');
const github = require('@actions/github');
const superAgent = require('superagent');
const fs =require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

async function getJsonBlock(path) {
  try {
    const buffer = await readFileAsync(path);

    return JSON.parse(buffer.toString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

(async () => {
  // const payload = JSON.stringify(github.context.payload, undefined, 2);
  // console.log(payload);

  try {
      title = core.getInput('message-title') || 'message title';
      const serviceUrl = core.getInput('service-url') || process.env.SERVICE_URL;
      const messageType = core.getInput('message-type') || 'slack_direct_message';
      const messageBody = core.getInput('message-body') || 'slack message body';
      const iconEmoji = core.getInput('icon-emoji') || ':butterbot:';
      const botName = core.getInput('bot-user-name') || 'notify bot';
      const jsonBlockFile = core.getInput('slack-block-json');
      const slackRecipientType = core.getInput('slack-recipient-type') || 'action-login';
      const slackRecipientName = core.getInput('slack-recipient-name') || 'issue.user.login';

      const messageStructure = {};
      messageStructure.body = messageBody || 'no body specified?';
      messageStructure.message_type = messageType;
      if (title) {
        messageStructure.title = title;
      }
      if (iconEmoji) {
        messageStructure.icon_emoji = iconEmoji;
      }
      if (botName) {
        messageStructure.bot_user_name = botName;
      }
      if (jsonBlockFile) {
        messageStructure.blocks = await getJsonBlock(jsonBlockFile);
      }

      if (slackRecipientType === 'action-login') {
        if (slackRecipientName === 'comment.user.login') {
          messageStructure.github_user_name = github.context.payload.comment.user.login;
        }
        if (slackRecipientName === 'user.sender.login') {
          messageStructure.github_user_name = github.context.payload.sender.user.login;
        }
        if (slackRecipientName === 'issue.user.login') {
          messageStructure.github_user_name = github.context.payload.issue.user.login;
        }
        if (slackRecipientName === 'pull_request.user.login') {
          messageStructure.github_user_name = github.context.payload.pull_request.user.login;
        }
        if (slackRecipientName === 'env.GITHUB_ACTOR') {
          messageStructure.github_user_name = process.env.GITHUB_ACTOR;
        }
      }
      if (slackRecipientType === 'github-user') {
        messageStructure.github_user_name = slackRecipientName;
      }
      if (slackRecipientType === 'slack-user') {
        messageStructure.slack_user_name = slackRecipientName;
      }
      if (slackRecipientType === 'slack-channel') {
        messageStructure.slack_channel_name = slackRecipientName;
      }
      if (slackRecipientType === 'email') {
        messageStructure.email = slackRecipientName;
      }
      if (slackRecipientType === 'aws-user') {
        messageStructure.aws_user_name = slackRecipientName;
      }

      try {
        console.log(JSON.stringify(messageStructure));
        await superAgent.post(serviceUrl)
          .set('Content-Type', 'application/json')
          .send(messageStructure);
      } catch (err) {
        core.setFailed(err.message);
        return process.exit(1);
      }
  } catch (error) {
    core.setFailed(error.message);
    process.exit(1);
  }
})();
