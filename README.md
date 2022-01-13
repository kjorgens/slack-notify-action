# slack notify action

This action sends messages to slack channels.

## About

GitHub Action to send a slack message from a github action

## Usage
**1. service-url (required)**

    url to external slack messaging service

**2. message-type (required)**

    slack_direct_message
    slack_channel
    email

**3. message-body (required)**

    Slack message body

**4. slack-recipient-type (required)**

    action-login
    github-user
    aws-user
    slack-channel
    slack-user
    email

    default: github-user

**5. slack-recipient-name (required)**

    depending on slack-recipient-type setting
    if slack-recipient-type is action-user valid values might be env.GITHUB_ACTOR
    comment.user.login or sender.login for events triggered by a pr comment
    issue.user.login for events triggered from a pull request

**6. blocks (optional)**

    JSON structure, see https://api.slack.com/reference/block-kit/blocks  

**7. icon-emoji (optional)**

    Slack icon emoji like :sad_parrot: etc
    
    default: none

**8. bot-user-name**

    Bot name to display with message

```yaml
name: Send slack message

on:
  issue_comment:
    types: [created]
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  some_action_job:
    runs-on: ubuntu-latest
    name: A job to send a slack message
    steps:
      # To use this repository's private action, you must check out the repository
      - name: Checkout
        uses: actions/checkout@v2
      - name: SlackMessage
        uses: kjorgens/slack-notify-action@main
        id: slackNotify
        with:
          service-url: 'https://yourSlacknotifyService.com'
          message-type: slack_direct_message
          message-body: action was performed
          slack-recipient-type: action-login
          slack-repipient-name: issue.user.login
          blocks: ./messageBlock.json
          icon-emoji: ':butterbot:'
          bot-user-name: SLack Notify Bot
                        
          
```
