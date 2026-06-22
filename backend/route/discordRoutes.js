const express = require('express');
const router = express.Router();
const { sendWithWebhook, sendScoreAlerts } = require('../service/DiscordService');

// Health
router.get('/health', (req, res) => {
	res.json({ ok: true });
});

// Send message using a webhook.
// Body: { content: string, webhookUrl?: string, username?: string, embeds?: Array }
router.post('/send-webhook', async (req, res) => {
	try {
		const { content, webhookUrl, username, embeds } = req.body;
		const url = webhookUrl || process.env.DISCORD_WEBHOOK_URL;
		if (!content) return res.status(400).json({ error: 'content is required' });
		if (!url) return res.status(400).json({ error: 'webhookUrl not provided and DISCORD_WEBHOOK_URL not set' });
		const result = await sendWithWebhook({ webhookUrl: url, content, username, embeds });
		res.json({ ok: true, result });
	} catch (err) {
		console.error('send-webhook error', err);
		res.status(500).json({ error: err.message });
	}
});

// Send score-based buy/sell recommendations using a Discord webhook.
// Body: { webhookUrl?: string, username?: string, day?: string, buyRecommendations?: Array, sellRecommendations?: Array }
router.post('/send-score-alerts', async (req, res) => {
	try {
		const { webhookUrl, username, day, buyRecommendations = [], sellRecommendations = [] } = req.body;
		const url = webhookUrl || process.env.DISCORD_WEBHOOK_URL;
		if (!url) return res.status(400).json({ error: 'webhookUrl not provided and DISCORD_WEBHOOK_URL not set' });
		if (!Array.isArray(buyRecommendations) || !Array.isArray(sellRecommendations)) {
			return res.status(400).json({ error: 'buyRecommendations and sellRecommendations must be arrays' });
		}

		const result = await sendScoreAlerts({
			webhookUrl: url,
			username,
			buyRecommendations,
			sellRecommendations,
			day,
		});

		res.json({
			ok: true,
			result,
			buyCount: buyRecommendations.length,
			sellCount: sellRecommendations.length,
		});
	} catch (err) {
		console.error('send-score-alerts error', err);
		res.status(500).json({ error: err.message });
	}
});

module.exports = router;
