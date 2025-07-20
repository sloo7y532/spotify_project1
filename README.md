# 🎵 Spotify Clone - Music Streaming Application

A feature-rich music streaming application built with React, TypeScript, and Firebase that replicates core Spotify functionality including user authentication, playlist management, music playback, and premium subscription features.

## ✨ Features

### 🎵 Music & Playback

- **Music Discovery**: Browse trending songs and discover new music
- **Advanced Music Player**: Full-featured player with play/pause, skip, progress tracking, and volume control
- **Real-time Audio**: Stream music with real-time progress updates and seamless playback
- **Search Functionality**: Search songs by title and artist across the entire music library
- **Playlist Management**: Create, edit, and manage personal playlists
- **Song Queue**: Add songs to playlists and manage playback queue

### 👤 User Authentication & Management

- **Secure Authentication**: Complete signup and login flows using Firebase Auth
- **Multi-step Registration**: Step-by-step user registration with email verification
- **Profile Management**: User profiles with personal information and preferences
- **Protected Routes**: Secure access to user-specific features and content
- **Session Management**: Persistent login sessions with automatic token refresh

### 💰 Premium Features

- **Subscription Plans**: Multiple premium tiers (Individual, Student, Duo)
- **Feature Comparison**: Detailed comparison of free vs premium features
- **Payment Integration**: Subscription management and billing information
- **Premium Benefits**: Ad-free listening, offline downloads, and enhanced audio quality

### 🌐 Internationalization

- **Multi-language Support**: English and Arabic language options
- **RTL Support**: Complete right-to-left layout support for Arabic
- **Dynamic Language Switching**: Real-time language switching throughout the app
- **Localized Content**: All text content translated and culturally adapted

### 📱 User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Clean, Spotify-inspired interface with smooth animations
- **Dark Theme**: Professional dark theme matching Spotify's design language
- **Loading States**: Comprehensive loading indicators and skeleton screens
- **Error Handling**: Graceful error handling with user-friendly messages
- **Toast Notifications**: Real-time feedback for user actions

## 🎬 Demo

Experience the live application: [**View Demo**](https://spotify-project-4dq2ezh00-salehs-projects-048dee6e.vercel.app/)

**Try these features:**

- 🎵 Browse and play music from the sample library
- 👤 Create an account and manage your profile
- 📋 Build custom playlists and add your favorite songs
- 💎 Explore premium subscription options
- 🌍 Switch between English and Arabic languages

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Firebase account for backend services

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/spotify-project.git
   cd spotify-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase**

   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication, Firestore, and Realtime Database
   - Copy your Firebase configuration to `src/firebase/firebase.js`
   - Update the Firebase configuration object with your project credentials

4. **Set up the database**

   - Import the sample data from `spotify-project-123-default-rtdb-export.json` to Firebase Realtime Database
   - Configure Firestore security rules for user authentication

5. **Start the development server**

   ```bash
   npm start
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application

## 🛠️ Tech Stack

### Frontend

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Redux Toolkit** - Predictable state management
- **React Router** - Client-side routing and navigation
- **Material-UI** - Modern React component library
- **Bootstrap** - Responsive CSS framework
- **React i18next** - Internationalization framework
- **Framer Motion** - Animation library for smooth transitions

### Backend & Services

- **Firebase Authentication** - Secure user authentication
- **Firestore** - NoSQL document database for user data
- **Firebase Realtime Database** - Real-time music library and data sync
- **Firebase Hosting** - Web application hosting (optional)

### Development Tools

- **Create React App** - Zero-configuration React setup
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting
- **React Testing Library** - Component testing utilities

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── login/          # Authentication components
│   ├── signup/         # User registration components
│   ├── MusicPlayer.tsx # Main music player component
│   ├── MusicTable.tsx  # Song list display
│   └── ...
├── pages/              # Page-level components
│   ├── Dashboard-Page.tsx
│   ├── Premium-Page.tsx
│   ├── CreatePlaylist-Page.tsx
│   └── ...
├── store/              # Redux store configuration
│   ├── slices/         # Redux state slices
│   │   ├── authSlice.ts
│   │   ├── musicSlice.ts
│   │   └── playlistSlice.ts
│   └── index.ts
├── firebase/           # Firebase configuration and services
├── services/           # API and external service integrations
├── styles/             # CSS stylesheets
├── locals/             # Translation files
├── types/              # TypeScript type definitions
└── assets/             # Images and static resources
```

## 🎯 Core Features Deep Dive

### Music Player

- Full audio controls (play, pause, skip, volume)
- Progress bar with seeking capability
- Song information display with cover art
- Queue management and playlist integration
- Shuffle and repeat functionality

### Playlist Management

- Create custom playlists with cover images
- Add/remove songs from playlists
- Edit playlist metadata (name, description, cover)
- Share playlists between users
- Real-time playlist updates

### Search & Discovery

- Global search across song library
- Filter by title, artist, and album
- Trending songs and recommendations
- Browse by categories and genres

### User Authentication

- Email/password registration and login
- Form validation and error handling
- Password strength requirements
- Profile information collection
- Secure session management

## 🔧 Available Scripts

- **`npm start`** - Start development server
- **`npm test`** - Run test suite
- **`npm run build`** - Build for production
- **`npm run eject`** - Eject from Create React App (irreversible)

## 🌍 Internationalization

The application supports multiple languages:

- **English (en)** - Default language
- **Arabic (ar)** - Full RTL support

Language files are located in `src/locals/` and can be extended to support additional languages.

## 🎨 Customization

### Themes

The application uses a dark theme by default. To customize:

- Modify CSS variables in `src/App.css`
- Update component styles in `src/styles/`
- Customize Material-UI theme configuration

### Adding New Features

1. Create components in `src/components/`
2. Add new pages in `src/pages/`
3. Define routes in `src/routes/index.tsx`
4. Update Redux store if needed

## 🚀 Deployment

### Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login to Firebase: `firebase login`
3. Initialize hosting: `firebase init hosting`
4. Build the project: `npm run build`
5. Deploy: `firebase deploy`

### Other Platforms

The build folder can be deployed to any static hosting service like Netlify, Vercel, or traditional web servers.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spotify** - Design inspiration and user experience patterns
- **Firebase** - Backend infrastructure and authentication
- **React Community** - Excellent ecosystem and documentation
- **Material-UI** - Beautiful and accessible component library

## 📞 Support

For support, questions, or feature requests:

- Create an issue on GitHub
- Contact the development team
- Check the documentation and FAQ

---

**Built with ❤️ using React, TypeScript, and Firebase**
