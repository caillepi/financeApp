const { WebhookClient } = require('discord.js');

function getWebhookClient(url) {
  return new WebhookClient({ url });
}

function buildScoreAlertContent(buyRecommendations, sellRecommendations, day) {
  const red = '\u2B55';
  const green = '\u2705';
  const header = `**Discord Score Alerts${day ? ` (${day})` : ''}**`;
  console.log('buildScoreAlertContent', { buyRecommendations, sellRecommendations, day });
  const buyLines = buyRecommendations.length
    ? buyRecommendations.map((item) => `• ${item.name.toUpperCase()} (${item.code.toUpperCase()}) — score ${Number(item.score).toFixed(2)}`).join('\n')
    : 'Aucune action d’achat recommandée.';
  const sellLines = sellRecommendations.length
    ? sellRecommendations.map((item) => `• ${item.name.toUpperCase()} (${item.code.toUpperCase()}) — score ${Number(item.score).toFixed(2)}`).join('\n')
    : 'Aucune action de vente recommandée.';

  return `${header}\n\n${green} **Acheter** (${buyRecommendations.length})\n${buyLines}\n\n${red} **Vendre** (${sellRecommendations.length})\n${sellLines}`;
}

async function sendWithWebhook({ webhookUrl, content, username, embeds }) {
  if (!webhookUrl) throw new Error('webhookUrl is required');
  const webhook = getWebhookClient(webhookUrl);
  return webhook.send({ content, username, embeds });
}

async function sendScoreAlerts({ webhookUrl, username, buyRecommendations, sellRecommendations, day }) {
  if (!webhookUrl) throw new Error('webhookUrl is required');
  const content = buildScoreAlertContent(buyRecommendations, sellRecommendations, day);
  return sendWithWebhook({ webhookUrl, username, content });
}

module.exports = {
  sendWithWebhook,
  sendScoreAlerts,
};
