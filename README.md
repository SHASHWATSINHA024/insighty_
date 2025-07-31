# Insighty - Real-time Trends Dashboard

A comprehensive MERN stack application that aggregates and displays real-time trends from Reddit, Twitter, and Google Trends. Features a beautiful 4-box dashboard with user authentication and personalized subreddit preferences.

## 🚀 Features

- **4-Box Dashboard Layout**: Clean, minimal design with real-time data from multiple sources
- **Multi-Source Integration**: Reddit API, Twitter API v2, and Google Trends via SerpAPI
- **User Authentication**: Secure login/signup with JWT tokens
- **Personalized Preferences**: Each user can customize their subreddit preferences
- **Real-time Updates**: Data refreshes every 4 minutes automatically
- **Fallback Content**: Predefined datasets when APIs are unavailable
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with React, Framer Motion, and modern CSS

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **node-cron** for scheduled tasks
- **axios** for API requests

### Frontend
- **React 18** with hooks
- **React Router** for navigation
- **Framer Motion** for animations
- **React Icons** for UI icons
- **Axios** for API communication

### APIs
- **Reddit API** (OAuth2)
- **Twitter API v2**
- **Google Trends** (via SerpAPI)

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Reddit API credentials
- Twitter API v2 credentials
- SerpAPI key (for Google Trends)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Insighty
   ```

2. **Install backend dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   cd ..
   ```

4. **Environment Setup**
   - Copy `env.example` to `.env`
   - Fill in your API credentials:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb+srv://User2:cfRWdnwllEs1xJMJ@cluster0.qmy9wgb.mongodb.net/TrendsDB?retryWrites=true&w=majority
   
   # JWT Secret
   JWT_SECRET=your_jwt_secret_key_here
   
   # Reddit API Configuration
   REDDIT_CLIENT_ID=ViZLZ_BfVi_CuhC10T8NHQ
   REDDIT_CLIENT_SECRET=y-frcQCN-dP5-se9m4ZRWb8RoKrRHQ
   REDDIT_USER_AGENT=Device1/1.0 (by /u/Just_Awareness_9501)
   
   # Twitter API v2 Configuration
   TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
   TWITTER_API_KEY=your_twitter_api_key_here
   TWITTER_API_SECRET=your_twitter_api_secret_here
   
   # Google Trends API (SerpAPI)
   SERPAPI_KEY=your_serpapi_key_here
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Data Update Interval (in minutes)
   UPDATE_INTERVAL=4
   ```

## 🚀 Running the Application

### Development Mode
```bash
# Run both backend and frontend concurrently
npm run dev
```

### Production Mode
```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

### Individual Commands
```bash
# Backend only
npm run server

# Frontend only
cd client && npm start
```

## 📊 Dashboard Layout

The dashboard features a 2x2 grid layout with four main sections:

1. **Reddit Trends** (Orange theme)
   - Shows posts from user's preferred subreddits
   - Displays post titles, scores, and authors
   - Links to original Reddit posts

2. **Twitter Trends** (Blue theme)
   - Displays trending hashtags and topics
   - Shows tweet volumes and engagement
   - Links to Twitter search results

3. **Google Trends** (Green theme)
   - Shows trending search terms
   - Displays search volume data
   - Links to Google search results

4. **User Preferences & Stats** (Gray theme)
   - Current subreddit preferences
   - Quick statistics overview
   - Preference management interface

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Trends
- `GET /api/trends/dashboard` - Get all trends for dashboard
- `GET /api/trends/source/:source` - Get trends by source
- `GET /api/trends/reddit/preferences` - Get user's preferred subreddit trends
- `POST /api/trends/refresh` - Manual refresh of trends
- `GET /api/trends/stats` - Get trend statistics

### User Management
- `PUT /api/user/preferences` - Update subreddit preferences
- `GET /api/user/preferences` - Get user preferences
- `PUT /api/user/profile` - Update user profile

## 🔄 Data Flow

1. **Scheduled Updates**: Every 4 minutes, the system fetches fresh data from all APIs
2. **User Preferences**: Reddit data is filtered based on user's subreddit preferences
3. **Fallback System**: If APIs fail, predefined content is displayed
4. **Real-time Dashboard**: Frontend automatically refreshes data every 4 minutes
5. **Manual Refresh**: Users can manually refresh data using the refresh button

## 🎨 Customization

### Adding New Subreddits
Users can add their preferred subreddits through the preferences modal:
1. Click "Preferences" button in the dashboard
2. Add subreddit names (without "r/")
3. Save preferences to update Reddit trends

### Styling
The application uses a custom CSS framework with utility classes. Main color themes:
- Reddit: Orange (`bg-orange-50`, `border-orange-200`)
- Twitter: Blue (`bg-blue-50`, `border-blue-200`)
- Google Trends: Green (`bg-green-50`, `border-green-200`)

## 🧪 Testing

```bash
# Run frontend tests
cd client && npm test

# Backend testing can be added with Jest
npm test
```

## 📱 Responsive Design

The dashboard is fully responsive:
- **Desktop**: 2x2 grid layout
- **Tablet**: 2x2 grid with adjusted spacing
- **Mobile**: Single column layout

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcryptjs
- Rate limiting on API endpoints
- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization

## 🚀 Deployment

### Heroku
```bash
# Add Heroku remote
heroku git:remote -a your-app-name

# Deploy
git push heroku main
```

### Vercel (Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation for each service
- Ensure all environment variables are properly configured

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced filtering options
- [ ] Export functionality
- [ ] Dark mode theme
- [ ] More data sources
- [ ] Analytics dashboard
- [ ] Mobile app version 