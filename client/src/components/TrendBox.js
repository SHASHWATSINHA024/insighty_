import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiTrendingUp, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const TrendBox = ({ title, icon, trends, source, color, textColor }) => {
  const [expandedPosts, setExpandedPosts] = useState({});

  const formatScore = (score) => {
    if (score >= 1000000) return `${(score / 1000000).toFixed(1)}M`;
    if (score >= 1000) return `${(score / 1000).toFixed(1)}K`;
    return score.toString();
  };

  const toggleExpanded = (index) => {
    setExpandedPosts(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const truncateText = (text, maxLength = 150) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const getSourceColor = (source) => {
    switch (source) {
      case 'reddit': return 'bg-orange-100 text-orange-800';
      case 'twitter': return 'bg-blue-100 text-blue-800';
      case 'google-trends': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`card h-full border-2 ${color}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          <FiTrendingUp className="text-gray-500" />
          <span className="text-sm text-gray-600">{trends.length} trends</span>
        </div>
      </div>

      {/* Trends List */}
      <div className="space-y-3">
        {trends.length > 0 ? (
          trends.slice(0, 4).map((trend, index) => (
            <motion.div
              key={`${trend.title}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-lg p-3 border border-gray-100 hover:border-gray-200 transition-all duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
                    {trend.title}
                  </h4>

                  {trend.description && (
                    <div className="mb-2">
                      <p className="text-gray-600 text-xs leading-relaxed">
                        {expandedPosts[index] ? trend.description : truncateText(trend.description)}
                      </p>
                      {trend.description.length > 150 && (
                        <button
                          onClick={() => toggleExpanded(index)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1 flex items-center gap-1"
                        >
                          {expandedPosts[index] ? (
                            <>
                              <FiChevronUp className="w-3 h-3" />
                              Show less
                            </>
                          ) : (
                            <>
                              <FiChevronDown className="w-3 h-3" />
                              Show more
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                    {trend.subreddit && (
                      <span className={`px-2 py-1 rounded-full ${getSourceColor(source)}`}>
                        r/{trend.subreddit}
                      </span>
                    )}
                    {trend.author && trend.author !== 'twitter' && trend.author !== 'google' && (
                      <span>by {trend.author}</span>
                    )}
                    {trend.score > 0 && (
                      <span className="flex items-center gap-1">
                        <FiTrendingUp className="w-3 h-3" />
                        {formatScore(trend.score)}
                      </span>
                    )}
                    {trend.numComments && source === 'reddit' && (
                      <span className="flex items-center gap-1">
                        💬 {formatScore(trend.numComments)}
                      </span>
                    )}
                    {trend.isSelfPost && source === 'reddit' && (
                      <span className="text-blue-600 font-medium">📝 Self Post</span>
                    )}
                  </div>
                </div>

                <a
                  href={trend.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Open link"
                >
                  <FiExternalLink className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">No trends available</p>
            <p className="text-xs text-gray-400 mt-1">Data will appear here soon</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendBox;
