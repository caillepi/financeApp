import { useMemo, useState } from 'react';
import { Button, TextField, Box, Stack, Typography, Alert } from '@mui/material';
import { useReportData } from '../hook/useReportData.jsx';
import { getDay } from '../utils/day';

const getToday = () => getDay();

function DiscordTestButtons() {
  const { reportData = [] } = useReportData();
  const [content, setContent] = useState('Test message from webhook');
  const [username, setUsername] = useState('FinanceApp');
  const [day] = useState(getToday());
  const [minBuyScore, setMinBuyScore] = useState(30);
  const [maxSellScore, setMaxSellScore] = useState(70);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:5000';

  const buyRecommendations = useMemo(() => {
    const threshold = Number(minBuyScore);
    return reportData
      .filter((item) => item?.score !== null && item?.score !== undefined && Number(item.score) < threshold)
      .sort((a, b) => Number(a.score) - Number(b.score))
      .map(({ code, name, score }) => ({ code, name, score }));
  }, [reportData, minBuyScore]);

  const sellRecommendations = useMemo(() => {
    const threshold = Number(maxSellScore);
    return reportData
      .filter((item) => item?.score !== null && item?.score !== undefined && Number(item.score) > threshold)
      .sort((a, b) => Number(b.score) - Number(a.score))
      .map(({ code, name, score }) => ({ code, name, score }));
  }, [reportData, maxSellScore]);

  const testWebhook = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/discord/send-webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, username }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✓ Message sent to Discord!`);
      } else {
        setMessage(`✗ Error: ${data.error}`);
      }
    } catch (err) {
      setMessage(`✗ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const sendScoreAlerts = async () => {
    setLoading(true);
    try {
      const body = {
        username,
        day: day || undefined,
        buyRecommendations,
        sellRecommendations,
      };
      const res = await fetch(`${API_BASE}/discord/send-score-alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(`✓ Discord alert sent! ${data.buyCount} achats et ${data.sellCount} ventes recommandés.`);
      } else {
        setMessage(`✗ Error: ${data.error}`);
      }
    } catch (err) {
      setMessage(`✗ Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1, mt: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        🧪 Discord Webhook Test
      </Typography>

      <Stack gap={2}>
        <TextField
          label="Message"
          size="small"
          multiline
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
        />

        <TextField
          label="Username (optional)"
          size="small"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          fullWidth
        />

        <Button
          variant="contained"
          color="primary"
          size="medium"
          onClick={testWebhook}
          disabled={loading}
          fullWidth
        >
          {loading ? '⏳ Sending...' : '📨 Send test message'}
        </Button>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1   }}>
          <TextField
            label="Score buy max"
            size="small"
            type="number"
            value={minBuyScore}
            onChange={(e) => setMinBuyScore(e.target.value)}
            fullWidth
          />
          <TextField
            label="Score sell min"
            size="small"
            type="number"
            value={maxSellScore}
            onChange={(e) => setMaxSellScore(e.target.value)}
            fullWidth
          />
        </Box>

        <TextField
          label="Jour (YYYY-MM-DD)"
          size="small"
          value={day}
          disabled
          fullWidth
        />

        <Button
          variant="outlined"
          color="secondary"
          size="medium"
          onClick={sendScoreAlerts}
          disabled={loading}
          fullWidth
        >
          {loading ? '⏳ Sending...' : '📈 Send buy/sell alerts'}
        </Button>

        {message && (
          <Alert
            severity={message.startsWith('✓') ? 'success' : 'error'}
            sx={{ fontSize: '0.85rem' }}
          >
            {message}
          </Alert>
        )}
      </Stack>
    </Box>
  );
}

export default DiscordTestButtons;
