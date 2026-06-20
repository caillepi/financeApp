import { useState } from 'react';
import { Button, TextField, Box, Stack, Typography, Alert } from '@mui/material';

function DiscordTestButtons() {
  const [content, setContent] = useState('Test message from webhook');
  const [username, setUsername] = useState('FinanceApp');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const API_BASE = 'http://localhost:5000';

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
          {loading ? '⏳ Sending...' : '📨 Send to Discord'}
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
