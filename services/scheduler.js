const cron = require('node-cron');
const redditService = require('./redditService');
const twitterService = require('./twitterService');
const googleTrendsService = require('./googleTrendsService');
const User = require('../models/User');
const Trend = require('../models/Trend');

class SchedulerService {
  constructor() {
    this.isRunning = false;
  }

  start() {
    console.log('🕒 Starting trend data scheduler...');
    
    cron.schedule('*/4 * * * *', async () => {
      console.log('🔄 Cron job triggered...');
      await this.updateAllTrends();
    }, {
      scheduled: true,
      timezone: "UTC"
    });

    this.updateAllTrends(); // Also run once on startup
  }

  async updateAllTrends() {
    if (this.isRunning) {
      console.log('⚠️ Update already in progress, skipping...');
      return;
    }

    this.isRunning = true;

    try {
      console.log('📥 Fetching all users from DB...');
      const users = await User.find({});

      const defaultSubreddits = ['programming', 'technology', 'science', 'news'];
      
      // 🔄 Combine all users' subreddit preferences
      const allPreferences = users.flatMap(user => user.subredditPreferences || []);
      const uniquePreferences = [...new Set(allPreferences)];

      const subredditPreferences = uniquePreferences.length > 0 
        ? uniquePreferences 
        : defaultSubreddits;

      console.log('📌 Final subreddit list used by scheduler:', subredditPreferences);

      // 🔥 Fetch Reddit Trends from r/all
      console.log('📡 Fetching r/all Reddit trends...');
      const trendingReddit = await redditService.fetchAndSaveTrendingPosts();

      // 🌐 Fetch subreddit-specific posts
      console.log('📡 Fetching subreddit posts...');
      const subredditReddit = await redditService.fetchAndSavePosts(subredditPreferences);

      // 🐦 & 🔍 Fetch Twitter and Google Trends in parallel
      console.log('🌍 Fetching Twitter and Google Trends...');
      const [twitterData, googleData] = await Promise.allSettled([
        twitterService.fetchAndSaveTrends(),
        googleTrendsService.fetchAndSaveTrends()
      ]);

      // 🧹 Cleanup old trends
      await this.cleanupOldTrends();

      console.log('✅ Trend update completed:');
      console.log('   - 🧠 Reddit Trends from r/all:', trendingReddit.length);
      console.log('   - 📚 Subreddit Posts:', subredditReddit.length);
      console.log('   - 🐦 Twitter:', twitterData.status === 'fulfilled' ? '✅ Success' : '❌ Failed');
      console.log('   - 🔍 Google Trends:', googleData.status === 'fulfilled' ? '✅ Success' : '❌ Failed');

    } catch (error) {
      console.error('❌ Error in scheduled trend update:', error);
    } finally {
      this.isRunning = false;
    }
  }

  async cleanupOldTrends() {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const result = await Trend.deleteMany({ createdAt: { $lt: twentyFourHoursAgo } });
      console.log(`🧹 Cleaned up ${result.deletedCount} old trends`);
    } catch (error) {
      console.error('❌ Error cleaning up old trends:', error);
    }
  }

  stop() {
    console.log('🛑 Stopping trend data scheduler...');
  }
}

module.exports = new SchedulerService();
