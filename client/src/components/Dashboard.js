import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FiRefreshCw, FiSettings } from 'react-icons/fi';
import TrendBox from './TrendBox';
import PreferencesModal from './PreferencesModal';
import LoadingSpinner from './LoadingSpinner';
import SubredditLatestPost from './SubredditLatestPost';

// Helper to filter unique by title
const uniqueByTitle = (arr) => {
  const seen = new Set();
  return arr.filter(item => {
    if (!item.title || seen.has(item.title)) return false;
    seen.add(item.title);
    return true;
  });
};

const Dashboard = () => {
  const [trends, setTrends] = useState({
    reddit: [],
    twitter: [],
    googleTrends: [],
    subredditLatest: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchTrends();
    const interval = setInterval(fetchTrends, 4 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const fetchTrends = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get('/api/trends/dashboard');
      setTrends(response.data);
      setLastUpdated(new Date());

      console.log('📥 Raw Twitter Trends:', response.data.twitter.map(t => t.title));
    } catch (error) {
      console.error('Error fetching trends:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchTrends();
  };

  const handlePreferencesUpdate = async (newPreferences) => {
    try {
      await axios.put('/api/user/preferences', { subredditPreferences: newPreferences });
      fetchTrends();
      setShowPreferences(false);
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  const subredditLatestUnique = uniqueByTitle(trends.subredditLatest);
  const redditTrendsUnique = uniqueByTitle(trends.reddit);

  // ✅ Do NOT filter out used titles from Twitter anymore
  const twitterTrendsUnique = uniqueByTitle(trends.twitter);

  // ✅ Still avoid title overlaps with subreddit+reddit for Google Trends
  const usedTitles = new Set([
    ...subredditLatestUnique.map(p => p.title),
    ...redditTrendsUnique.map(p => p.title),
    ...twitterTrendsUnique.map(p => p.title),
  ]);
  const googleTrendsUnique = uniqueByTitle(trends.googleTrends).filter(post => !usedTitles.has(post.title));

  return (
    
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
  

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Insighty Dashboard</h1>
          <p className="text-gray-600">
            Real-time trends from Reddit, Twitter, and Google Trends
            {lastUpdated && (
              <span className="ml-2 text-sm text-gray-500">
                • Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn btn-outline flex items-center gap-2"
          >
            <FiRefreshCw className={`${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowPreferences(true)}
            className="btn btn-secondary flex items-center gap-2"
          >
            <FiSettings />
            Preferences
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <TrendBox
            title="Reddit Trends"
            icon="📱"
            trends={redditTrendsUnique}
            source="reddit"
            color="bg-orange-50 border-orange-200"
            textColor="text-orange-800"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <TrendBox
            title="Google Trends"
            icon="🔍"
            trends={googleTrendsUnique}
            source="google-trends"
            color="bg-green-50 border-green-200"
            textColor="text-green-800"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
          <TrendBox
            title="Twitter Trends"
            icon="🐦"
            trends={twitterTrendsUnique}
            source="twitter"
            color="bg-blue-50 border-blue-200"
            textColor="text-blue-800"
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
          <SubredditLatestPost onAdd={fetchTrends} posts={subredditLatestUnique} />
        </motion.div>
      </div>

      {showPreferences && (
        <PreferencesModal
          onClose={() => setShowPreferences(false)}
          onUpdate={handlePreferencesUpdate}
        />
      )}
    </div>
  );
};

export default Dashboard;
