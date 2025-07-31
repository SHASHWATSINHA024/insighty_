const axios = require('axios');
const Trend = require('../models/Trend');

class GoogleTrendsService {
  constructor() {
    this.apiKey = process.env.SERPAPI_KEY || '552620f81cb16f15026536884e6c12e89aa3a0e2fbf4dc7766ece5d2576b6251';
    this.baseUrl = 'https://serpapi.com/search.json';
  }

  async fetchTrendingSearches(limit = 4) {
    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          api_key: this.apiKey,
          engine: 'google_trends_trending_now',
          geo: 'IN'
        }
      });

      const searches = response.data.trending_searches || [];

      return searches.slice(0, limit).map(trend => ({
        title: trend.query || 'Trending Topic',
        description: `Search volume: ${trend.search_volume || 'Unknown'}`,
        url: `https://www.google.com/search?q=${encodeURIComponent(trend.query)}`,
        score: trend.search_volume || 1000,
        subreddit: '',
        author: 'google',
        source: 'google-trends'
      }));
    } catch (error) {
      console.error('Google Trends API error:', error.message);
      return this.getFallbackGoogleTrendsData().slice(0, 4);
    }
  }

  async fetchAndSaveTrends() {
    try {
      const trends = await this.fetchTrendingSearches(4);
      const trendsToSave = trends.map(trend => new Trend(trend));
      await Trend.insertMany(trendsToSave);
      return trends;
    } catch (error) {
      console.error('Error in fetchAndSaveTrends:', error.message);
      return this.getFallbackGoogleTrendsData().slice(0, 4);
    }
  }

  getFallbackGoogleTrendsData() {
    return [
      {
        title: 'ChatGPT alternatives',
        description: 'People searching for AI chatbot alternatives',
        url: 'https://www.google.com/search?q=ChatGPT+alternatives',
        score: 85000,
        subreddit: '',
        author: 'google',
        source: 'google-trends'
      },
      {
        title: 'React vs Vue',
        description: 'Comparison between popular JavaScript frameworks',
        url: 'https://www.google.com/search?q=React+vs+Vue',
        score: 67000,
        subreddit: '',
        author: 'google',
        source: 'google-trends'
      },
      {
        title: 'Machine learning courses',
        description: 'Online courses for machine learning and AI',
        url: 'https://www.google.com/search?q=machine+learning+courses',
        score: 54000,
        subreddit: '',
        author: 'google',
        source: 'google-trends'
      },
      {
        title: 'Blockchain technology',
        description: 'Understanding blockchain and cryptocurrency',
        url: 'https://www.google.com/search?q=blockchain+technology',
        score: 43000,
        subreddit: '',
        author: 'google',
        source: 'google-trends'
      },
      {
        title: 'Cybersecurity best practices',
        description: 'Protecting against cyber threats and attacks',
        url: 'https://www.google.com/search?q=cybersecurity+best+practices',
        score: 32000,
        subreddit: '',
        author: 'google',
        source: 'google-trends'
      }
    ];
  }
}

module.exports = new GoogleTrendsService();
