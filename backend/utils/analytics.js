const Analytics = require('../models/Analytics');

/**
 * Track an analytics event with daily rollup (upsert).
 * Non-blocking — errors are swallowed so analytics never breaks the app.
 */
const trackEvent = async (event, meta = {}) => {
  try {
    const date = new Date().toISOString().split('T')[0];
    await Analytics.findOneAndUpdate(
      { date, event },
      { $inc: { count: 1 }, $set: { meta } },
      { upsert: true }
    );
  } catch (_) { /* silent — analytics must never break primary flows */ }
};

module.exports = { trackEvent };
