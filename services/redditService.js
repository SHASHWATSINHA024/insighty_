const axios = require('axios');
const RedditTrend = require('../models/RedditTrend');
const Trend = require('../models/Trend'); // ✅ Needed to insert into 'Trend' collection

class RedditService {
  constructor() {
    this.clientId = process.env.REDDIT_CLIENT_ID;
    this.clientSecret = process.env.REDDIT_CLIENT_SECRET;
    this.userAgent = process.env.REDDIT_USER_AGENT;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.accessToken && Date.now() < this.tokenExpiry) return this.accessToken;

    const response = await axios.post(
      'https://www.reddit.com/api/v1/access_token',
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64')}`,
          'User-Agent': this.userAgent,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    this.accessToken = response.data.access_token;
    this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
    return this.accessToken;
  }

  async fetchTrendingRedditPosts(limit = 10) {
    await this.getAccessToken();
    const res = await axios.get(`https://oauth.reddit.com/r/all/hot?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'User-Agent': this.userAgent
      }
    });

    return res.data.data.children.map(post => ({
      title: post.data.title,
      description: '',
      url: `https://reddit.com${post.data.permalink}`,
      score: post.data.score,
      subreddit: post.data.subreddit,
      author: post.data.author,
      source: 'reddit',
      redditId: post.data.id,
      created_utc: post.data.created_utc,
      fromAll: true
    }));
  }

  async fetchAndSaveTrendingPosts() {
    const posts = await this.fetchTrendingRedditPosts(50);
    for (const post of posts) {
      await RedditTrend.updateOne(
        { redditId: post.redditId },
        { $set: post },
        { upsert: true }
      );
    }
    return posts;
  }

  async fetchAndSavePosts(subreddits = []) {
    await this.getAccessToken();

    // ✅ Only delete subreddit-specific posts (not from r/all)
    await Trend.deleteMany({ source: 'reddit', fromAll: false });

    const getRandomItems = (arr, count = 3) => {
      const shuffled = arr.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    const allPosts = [];

    for (const subreddit of subreddits) {
      console.log(`Fetching from subreddit: ${subreddit}`);

      const res = await axios.get(`https://oauth.reddit.com/r/${subreddit}/hot?limit=10`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'User-Agent': this.userAgent
        }
      });

      const fetchedPosts = res.data.data.children.map(post => ({
        title: post.data.title,
        description: '',
        url: `https://reddit.com${post.data.permalink}`,
        score: post.data.score,
        subreddit: post.data.subreddit,
        author: post.data.author,
        source: 'reddit',
        redditId: post.data.id,
        created_utc: post.data.created_utc,
        fromAll: false
      }));

      const selectedPosts = getRandomItems(fetchedPosts, 3);

      for (const post of selectedPosts) {
        await Trend.updateOne(
          { redditId: post.redditId },
          { $set: post },
          { upsert: true }
        );
      }

      allPosts.push(...selectedPosts);
    }

    return allPosts;
  }
}

module.exports = new RedditService();
