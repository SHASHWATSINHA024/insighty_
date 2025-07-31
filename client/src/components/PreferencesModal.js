import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

const PreferencesModal = ({ onClose, onUpdate }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState([]);
  const [newSubreddit, setNewSubreddit] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.subredditPreferences) {
      setPreferences([...user.subredditPreferences]);
    }
  }, [user]);

  const handleAddSubreddit = () => {
    if (newSubreddit.trim() && !preferences.includes(newSubreddit.trim().toLowerCase())) {
      setPreferences([...preferences, newSubreddit.trim().toLowerCase()]);
      setNewSubreddit('');
    }
  };

  const handleRemoveSubreddit = (index) => {
    setPreferences(preferences.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    await onUpdate(preferences);
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSubreddit();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Manage Preferences</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            <div>
              <label className="form-label">Subreddit Preferences</label>
              <p className="text-sm text-gray-600 mb-4">
                Add your favorite subreddits to customize your Reddit trends
              </p>
              
              {/* Add new subreddit */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newSubreddit}
                  onChange={(e) => setNewSubreddit(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter subreddit name (e.g., programming)"
                  className="form-input flex-1"
                />
                <button
                  onClick={handleAddSubreddit}
                  disabled={!newSubreddit.trim()}
                  className="btn px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>

              {/* Current preferences */}
              <div className="space-y-2">
                {preferences.length > 0 ? (
                  preferences.map((subreddit, index) => (
                    <motion.div
                      key={subreddit}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-900">r/{subreddit}</span>
                      <button
                        onClick={() => handleRemoveSubreddit(index)}
                        className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No subreddits added yet</p>
                    <p className="text-xs text-gray-400 mt-1">
                      Add your favorite subreddits above
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Popular suggestions */}
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Popular Subreddits</h4>
              <div className="flex flex-wrap gap-2">
                {['programming', 'technology', 'science', 'news', 'webdev', 'reactjs'].map((subreddit) => (
                  <button
                    key={subreddit}
                    onClick={() => {
                      if (!preferences.includes(subreddit)) {
                        setPreferences([...preferences, subreddit]);
                      }
                    }}
                    disabled={preferences.includes(subreddit)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    r/{subreddit}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="btn"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                'Save Preferences'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PreferencesModal; 