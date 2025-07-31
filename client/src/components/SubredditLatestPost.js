import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FiExternalLink } from 'react-icons/fi';

const SubredditLatestPost = ({ posts = [] }) => {
  const { user } = useAuth();

  return (
    <div className="card h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🆕</span>
          <h3 className="text-xl font-semibold">Subreddit Latest Posts</h3>
        </div>

        <div className="mb-2">
          <label className="form-label">Current Subreddit</label>
          <div className="font-medium text-blue-700">
            {user?.subredditPreferences?.join(', ') || 'None'}
          </div>
        </div>

        {posts.length > 0 ? (
          <div className="space-y-3 mt-2">
            {posts.map((post, idx) => (
              <div key={post.url + idx} className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1 font-semibold">r/{post.subreddit}</div>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-800 hover:underline flex items-center gap-1 mb-1"
                >
                  {post.title}
                  <FiExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm">No posts found.</div>
        )}
      </div>
    </div>
  );
};

export default SubredditLatestPost;
