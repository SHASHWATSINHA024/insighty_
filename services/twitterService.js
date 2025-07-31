const axios = require('axios');
const Trend = require('../models/Trend');

class TwitterService {
  constructor() {
    this.bearerToken = process.env.TWITTER_BEARER_TOKEN;
    this.baseUrl = 'https://api.twitter.com/2';
  }

  async fetchTrendingTopics() {
    try {
      if (!this.bearerToken) throw new Error('Twitter Bearer Token not configured');

    //   console.warn('Twitter API v2 does not support trends endpoint. Using fallback.');
      return this.getFallbackTwitterData();

    } catch (error) {
      console.error('Twitter API error:', error.message);
      return this.getFallbackTwitterData();
    }
  }

  async fetchAndSaveTrends() {
    try {
      await Trend.deleteMany({ source: 'twitter' });

      const trends = await this.fetchTrendingTopics();

      const existingTitles = await Trend.find({
        source: 'twitter',
        title: { $in: trends.map(t => t.title) }
      }).distinct('title');

      const newTrends = trends.filter(trend => !existingTitles.includes(trend.title));

      if (newTrends.length > 0) {
        const trendsToSave = newTrends.map(trend => new Trend(trend));
        await Trend.insertMany(trendsToSave);
      }

      return trends;
    } catch (error) {
      console.error('Error in fetchAndSaveTrends:', error.message);
      return this.getFallbackTwitterData();
    }
  }

  getFallbackTwitterData() {
    const fallback = [
      {
        title: '#AIRevolution',
        description: 'Artificial Intelligence transforming industries worldwide',
        url: 'https://twitter.com/search?q=%23AIRevolution',
        score: 125000,
        subreddit: '',
        author: 'twitter',
        source: 'twitter'
      },
      {
        title: '#TechInnovation',
        description: 'Latest breakthroughs in technology and innovation',
        url: 'https://twitter.com/search?q=%23TechInnovation',
        score: 89000,
        subreddit: '',
        author: 'twitter',
        source: 'twitter'
      },
      {
        title: '#WebDevelopment',
        description: 'Modern web development trends and best practices',
        url: 'https://twitter.com/search?q=%23WebDevelopment',
        score: 67000,
        subreddit: '',
        author: 'twitter',
        source: 'twitter'
      },
      {
        title: '#DataScience',
        description: 'Data science and machine learning insights',
        url: 'https://twitter.com/search?q=%23DataScience',
        score: 54000,
        subreddit: '',
        author: 'twitter',
        source: 'twitter'
      },
      {
        title: '#CyberSecurity',
        description: 'Latest updates in the cybersecurity world',
        url: 'https://twitter.com/search?q=%23CyberSecurity',
        score: 62000,
        subreddit: '',
        author: 'twitter',
        source: 'twitter'
      },
      {
        title: '#CloudComputing',
        description: 'Trends and best practices in cloud computing',
        url: 'https://twitter.com/search?q=%23CloudComputing',
        score: 49000,
        subreddit: '',
        author: 'twitter',
        source: 'twitter'
      },
      {
        title: '#MachineLearning',
        description: 'Machine learning algorithms and tools',
        url: 'https://twitter.com/search?q=%23MachineLearning',
        score: 71000,
        subreddit: '',
        author: 'twitter',
        source: 'twitter'
      },
      {
        title: '#QuantumComputing',
        description: 'Advancements in quantum computing',
        url: 'https://twitter.com/search?q=%23QuantumComputing',
        score: 46000,
        subreddit: '',
        author: 'twitter',
        source: 'twitter'
      },
      {
        title: '#DevOps',
        description: 'CI/CD and DevOps automation tools',
        url: 'https://twitter.com/search?q=%23DevOps',
        score: 53000,
        subreddit: '',
        author: 'twitter',
        source: 'twitter'
      },
      {
        title: '#OpenSource',
        description: 'Top open source projects and communities',
        url: 'https://twitter.com/search?q=%23OpenSource',
        score: 58000,
        subreddit: '',
        author: 'twitter',
        source: 'twitter'
      },
      {
        title: '#RemoteWork',
        description: 'Work-from-home trends and tools',
        url: 'https://twitter.com/search?q=%23RemoteWork',
        score: 49500,
        subreddit: '',
        author: 'twitter',
        source: 'twitter'
      },
      {
        title: '#TechNews',
        description: 'Latest tech news from around the world',
        url: 'https://twitter.com/search?q=%23TechNews',
        score: 74000,
        subreddit: '',
        author: 'twitter',
        source: 'twitter'
      }
    ];

    // Shuffle and return 3 random ones
    const shuffled = fallback.sort(() => 0.5 - Math.random());
   
    return shuffled.slice(0, 3);
  }
}

module.exports = new TwitterService();
