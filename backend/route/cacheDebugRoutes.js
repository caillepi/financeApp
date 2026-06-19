const express = require('express');
const { staticCache, dynamicCache } = require('../utils/cache');
const router = express.Router();

const isDev = process.env.NODE_ENV !== 'production';

function requireDev(req, res, next) {
  if (!isDev) {
    return res.status(403).json({ error: 'Cache debug routes are only available in development.' });
  }
  next();
}

router.use(requireDev);

router.get('/inspect', (req, res) => {
  res.json({
    staticCache: staticCache.inspect({ full: true, limit: 200 }),
    dynamicCache: dynamicCache.inspect({ full: true, limit: 200 })
  });
});

router.post('/clear/static', (req, res) => {
  staticCache.clear();
  res.json({ success: true, message: 'Static cache cleared.' });
});

router.post('/clear/dynamic', (req, res) => {
  dynamicCache.clear();
  res.json({ success: true, message: 'Dynamic cache cleared.' });
});

router.post('/invalidate/static', (req, res) => {
  const { key, prefix } = req.body;
  if (!key && !prefix) {
    return res.status(400).json({ error: 'key or prefix required' });
  }
  const removed = key ? (staticCache.invalidate(key) ? 1 : 0) : staticCache.invalidatePrefix(prefix);
  res.json({ success: true, removed });
});

router.post('/invalidate/dynamic', (req, res) => {
  const { key, prefix } = req.body;
  if (!key && !prefix) {
    return res.status(400).json({ error: 'key or prefix required' });
  }
  const removed = key ? (dynamicCache.invalidate(key) ? 1 : 0) : dynamicCache.invalidatePrefix(prefix);
  res.json({ success: true, removed });
});

module.exports = router;
