const mongoose = require('mongoose');

const trendSchema = new mongoose.Schema({
  source: {
    type: String,
    required: true,
    enum: ['reddit', 'twitter', 'google-trends']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    default: 0
  },
  subreddit: {
    type: String,
    default: ''
  },
  author: {
    type: String,
    default: ''
  },
  redditId: {
    type: String,
    unique: true,
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Update timestamp on save
trendSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
trendSchema.index({ source: 1, createdAt: -1 });
trendSchema.index({ subreddit: 1, createdAt: -1 });

module.exports = mongoose.model('Trend', trendSchema); 