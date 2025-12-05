# InstaAnalytics - Instagram Engagement Analyzer

A modern, gamified web application for analyzing Instagram account engagement rates. Built with React, TypeScript, and Python, featuring real-time analytics, interactive quizzes, leaderboards, and account comparison tools.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-3178C6?logo=typescript)

## ✨ Features

### 📊 Core Analytics
- **Engagement Rate Calculation** - Comprehensive analysis of Instagram account performance
- **Real-time Statistics** - Live stats tracking with session-based metrics
- **Industry Benchmarks** - Compare your engagement against industry standards
- **Account Comparison** - VS Mode to compare two Instagram accounts side-by-side

### 🎮 Gamification
- **Points System** - Earn points for analyzing accounts
- **Achievement Unlocks** - Unlock achievements as you progress
- **Level Progression** - Level up based on your activity
- **Daily Challenges** - Complete daily challenges to earn rewards
- **Leaderboard** - Compete with other users

### 📱 User Experience
- **Mobile Optimized** - Fully responsive design for all devices
- **Interactive Quiz** - Test your Instagram analytics knowledge
- **Beautiful UI** - Modern gradient design with smooth animations
- **Real-time Feedback** - Instant visual feedback for all actions

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shrey-bhandary/insta-frontend.git
   cd insta-frontend
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the backend server**
   ```bash
   # Navigate to the api directory and start your Python server
   # (Adjust based on your backend setup)
   python -m api
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   Navigate to http://localhost:5173
   ```

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

### Backend
- **Python** - Backend API
- **Flask/FastAPI** - Web framework (based on your setup)

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
insta-frontend/
├── api/                    # Backend API endpoints
│   ├── engagement.py      # Engagement analysis logic
│   ├── scraper.py         # Instagram data scraping
│   ├── stats.py           # Statistics calculations
│   └── utils.py           # Utility functions
├── src/
│   ├── components/         # React components
│   │   ├── Achievements.tsx
│   │   ├── CompareMode.tsx
│   │   ├── DailyChallenge.tsx
│   │   ├── ExhibitionStats.tsx
│   │   ├── Leaderboard.tsx
│   │   ├── Quiz.tsx
│   │   └── ...
│   ├── utils/             # Utility functions
│   │   └── gamification.ts
│   ├── data/              # Static data
│   │   └── quizQuestions.json
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── package.json           # Frontend dependencies
├── requirements.txt       # Backend dependencies
└── vite.config.ts         # Vite configuration
```

## 🎯 Usage

### Analyzing an Account

1. Navigate to the **Analyze** tab
2. Enter an Instagram username
3. Click **"ANALYZE MY ENGAGEMENT"**
4. View comprehensive engagement metrics including:
   - Total followers
   - Average likes per post
   - Average comments per post
   - Engagement rate percentage

### VS Mode

1. Select **VS Mode** from the mode selector
2. Enter two Instagram usernames
3. Click **"Analyze Both Accounts"**
4. Compare engagement rates, followers, likes, and comments side-by-side

### Gamification Features

- **Earn Points**: Analyze accounts to earn points
- **Level Up**: Accumulate points to increase your level
- **Unlock Achievements**: Complete milestones to unlock achievements
- **Daily Challenges**: Check the Stats tab for daily challenges
- **Quiz**: Test your knowledge in the Quiz tab
- **Leaderboard**: View top performers in the Leaderboard tab

## 📊 Engagement Rate Benchmarks

The app categorizes engagement rates into four tiers:

- **Excellent** (6%+) - Top performers
- **Good** (3% - 6%) - Above average
- **Average** (1% - 3%) - Industry standard
- **Needs Work** (Below 1%) - Room for growth

## 🔧 Configuration

### Vite Proxy Configuration

The app uses Vite's proxy to connect to the backend API. Configure the proxy in `vite.config.ts`:

```typescript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

### Environment Variables

Create a `.env` file for environment-specific configurations:

```env
VITE_API_URL=http://localhost:3000
```

## 📱 Mobile Optimization

The application is fully optimized for mobile devices with:
- Responsive layouts that adapt to screen sizes
- Touch-friendly interactive elements (minimum 44px touch targets)
- Mobile-optimized navigation and tabs
- Responsive typography and spacing
- Optimized grid layouts for small screens

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Building for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Developer

**Shreyas Bhandary**

- GitHub: [@shrey-bhandary](https://github.com/shrey-bhandary)
- Project: [InstaAnalytics](https://github.com/shrey-bhandary/insta-frontend)

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)
- Powered by [Vite](https://vitejs.dev/)

## 📧 Support

For support, please open an issue on the [GitHub repository](https://github.com/shrey-bhandary/insta-frontend/issues).

---

⭐ If you find this project helpful, please consider giving it a star!

