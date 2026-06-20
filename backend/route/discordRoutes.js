const express = require('express');
const router = express.Router();
const { sendWithWebhook } = require('../service/DiscordService');

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

module.exports = router;
