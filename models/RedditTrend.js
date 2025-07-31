const mongoose = require('mongoose');

const redditTrendSchema = new mongoose.Schema({
  redditId: String, // ✅ required for upsert
  title: String,
  url: String,
  score: Number,
  subreddit: String,
  author: String,
  num_comments: Number,
  created_utc: Number,
  isActive: { type: Boolean, default: true },
  fetchedAt: { type: Date, default: Date.now }
}, {
  collection: 'reddit_trends'
});

module.exports = mongoose.model('RedditTrend', redditTrendSchema);
