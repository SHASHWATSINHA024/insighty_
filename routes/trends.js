const express = require('express');
const Trend = require('../models/Trend');
const RedditTrend = require('../models/RedditTrend'); // ✅ Make sure this model exists
const User = require('../models/User');
const auth = require('../middleware/auth');
const redditService = require('../services/redditService');
const twitterService = require('../services/twitterService');
const googleTrendsService = require('../services/googleTrendsService');

const router = express.Router();

// Get all trends for dashboard
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const subredditPreferences = user.subredditPreferences || [];
    const preferredSubreddit = subredditPreferences[0] || 'programming';

    // Get Reddit Trends from r/all (general trends)
    const redditTrends = await RedditTrend.find({
      subreddit: { $ne: preferredSubreddit },
      isActive: true
    })
      .sort({ score: -1, created_utc: -1 })
      .limit(8);

    // Get one latest post from each preferred subreddit
    const subredditLatest = [];
    for (const sub of subredditPreferences) {
      const post = await Trend.findOne({
        source: 'reddit',
        subreddit: sub,
        isActive: true
      })
        .sort({ created_utc: -1 })
        .exec();
      if (post) subredditLatest.push(post);
    }

    // Get Twitter and Google Trends
    const [twitterTrends, googleTrends] = await Promise.all([
      Trend.find({ source: 'twitter', isActive: true }).sort({ score: -1, createdAt: -1 }).limit(8),
      Trend.find({ source: 'google-trends', isActive: true }).sort({ score: -1, createdAt: -1 }).limit(8)
    ]);

    res.json({
      reddit: redditTrends,
      twitter: twitterTrends,
      googleTrends: googleTrends,
      subredditLatest: subredditLatest
    });
    console.log('🧠 Twitter Trends from backend:', twitterTrends.map(t => t.title));
  } catch (error) {
    console.error('Dashboard trends error:', error);
    res.status(500).json({ message: 'Error fetching trends' });
  }
});

// Get trends by source
router.get('/source/:source', auth, async (req, res) => {
  try {
    const { source } = req.params;
    const { limit = 10, subreddit } = req.query;

    const query = { source, isActive: true };
    if (subreddit) {
      query.subreddit = subreddit;
    }

    const sortField = source === 'reddit' ? { created_utc: -1 } : { createdAt: -1 };

    const trends = await Trend.find(query)
      .sort(sortField)
      .limit(parseInt(limit));

    res.json(trends);
  } catch (error) {
    console.error('Source trends error:', error);
    res.status(500).json({ message: 'Error fetching trends' });
  }
});

// Get user's preferred subreddit trends
router.get('/reddit/preferences', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const trends = await Trend.find({
      source: 'reddit',
      subreddit: { $in: user.subredditPreferences },
      isActive: true
    })
      .sort({ score: -1, createdAt: -1 })
      .limit(10);

    res.json(trends);
  } catch (error) {
    console.error('Reddit preferences error:', error);
    res.status(500).json({ message: 'Error fetching reddit trends' });
  }
});

// Manual refresh trends (admin function)
router.post('/refresh', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const [redditData, twitterData, googleData] = await Promise.all([
      redditService.fetchAndSavePosts(user.subredditPreferences, user._id),
      twitterService.fetchAndSaveTrends(),
      googleTrendsService.fetchAndSaveTrends()
    ]);

    res.json({
      message: 'Trends refreshed successfully',
      counts: {
        reddit: redditData.length,
        twitter: twitterData.length,
        googleTrends: googleData.length
      }
    });
  } catch (error) {
    console.error('Refresh trends error:', error);
    res.status(500).json({ message: 'Error refreshing trends' });
  }
});

// Get trend statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Trend.aggregate([
      {
        $group: {
          _id: '$source',
          count: { $sum: 1 },
          avgScore: { $avg: '$score' },
          maxScore: { $max: '$score' }
        }
      }
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

module.exports = router;
