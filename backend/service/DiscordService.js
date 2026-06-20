const { WebhookClient } = require('discord.js');

function getWebhookClient(url) {
  return new WebhookClient({ url });
}

async function sendWithWebhook({ webhookUrl, content, username, embeds }) {
  if (!webhookUrl) throw new Error('webhookUrl is required');
  const webhook = getWebhookClient(webhookUrl);
  return webhook.send({ content, username, embeds });
}

module.exports = {
  sendWithWebhook,
};
