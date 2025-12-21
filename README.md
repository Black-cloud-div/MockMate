# MockMATE - AI Mock Interview System

A complete AI-powered interview preparation platform with voice analysis, MCQ tests, and detailed performance analytics.

## 🚀 Features

### Core Features
- **Voice AI Interview**: Real-time speech-to-text with AI feedback on clarity, confidence, and content
- **MCQ Tests**: Role-based multiple choice questions for technical assessment
- **Mock Interviews**: Traditional text-based interview practice with AI evaluation
- **Analytics Dashboard**: Beautiful charts showing your progress over time
- **Profile Management**: Save your preferences, career goals, and experience level

### Tech Stack
- **Frontend**: React + Vite, Lucide Icons, Recharts
- **Backend**: Node.js + Express
- **Database**: SQLite with Sequelize ORM
- **AI**: OpenAI GPT (optional - works in simulation mode without API key)
- **Speech**: Web Speech API (browser-native)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Steps

1. **Clone the repository**
```bash
cd "d:/AI mock interview"
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

4. **Configure Environment Variables**

Create `backend/.env`:
```env
JWT_SECRET=your_secret_key_here
OPENAI_API_KEY=sk-your-openai-key-here  # Optional
PORT=5000
```

5. **Initialize Database**
```bash
cd backend
node testDatabase.js
```

## 🎯 Running the Application

### Development Mode (Separate Servers)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

### Production Mode (Single Server)

1. **Build Frontend:**
```bash
cd frontend
npm run build
```

2. **Start Backend (serves frontend):**
```bash
cd backend
npm run dev
```

Access everything at: http://localhost:5000

## 📊 Database Models

### User
- id, name, email, password, provider, role
- careerGoal, experienceLevel
- emailNotifs, publicProfile

### Interview
- id, userId, role, difficulty
- question, answerText
- overallScore, strengths, improvements, dimensions

### Question
- id, role, difficulty, text, tags

### VoiceLog
- id, userId, role, question
- audioUrl, transcript, aiFeedback
- clarityScore, confidenceScore, overallScore

### MockTestResult
- id, userId, role, score, details

## 🔑 API Endpoints

### Authentication
- `POST /auth/register` - Create new account
- `POST /auth/login` - Login
- `POST /auth/google` - Google OAuth
- `GET /auth/profile` - Get user profile (protected)
- `PUT /auth/profile` - Update profile (protected)

### Interviews
- `POST /interview/generate-question` - Get interview question
- `POST /interview/submit` - Submit answer for evaluation
- `GET /interview/history` - Get interview history
- `GET /interview/result/:id` - Get specific result

### Voice AI
- `POST /voice/process` - Process voice interview answer

### MCQ Tests
- `GET /test/:role` - Get test questions for role
- `POST /test/submit` - Submit test answers

### Admin
- `GET /admin/users` - List all users
- `GET /admin/questions` - List all questions
- `POST /admin/add-question` - Add new question
- `DELETE /admin/question/:id` - Delete question

## 🎨 UI Features

- **Dark Theme**: Modern glassmorphism design
- **Responsive**: Works on all screen sizes
- **Animations**: Smooth transitions and micro-interactions
- **Charts**: Recharts for beautiful data visualization
- **Icons**: Lucide React icons throughout

## 🔧 Configuration

### Without OpenAI API Key
The system works in "Simulation Mode":
- Mock questions are generated from static templates
- AI feedback is randomized but realistic
- All features remain functional

### With OpenAI API Key
- Real-time AI question generation
- Intelligent answer evaluation
- Personalized feedback
- Dynamic difficulty adjustment

## 📝 Default Roles

- Frontend Developer
- Backend Developer
- Full-Stack Developer
- Mobile App Developer
- AI/ML Engineer
- Data Scientist
- Data Engineer
- DevOps Engineer
- Cloud Engineer
- Cybersecurity Engineer
- Blockchain Developer

## 🛠️ Utility Scripts

### Test Database
```bash
cd backend
node testDatabase.js
```

### Make User Admin
```bash
cd backend
node makeAdmin.js
```

## 🔐 Security Notes

- Passwords are hashed with bcrypt
- JWT tokens expire in 7 days
- CORS is configured for development
- Admin routes should use `adminOnly` middleware in production

## 📱 Browser Compatibility

- Chrome/Edge: Full support (recommended)
- Firefox: Full support
- Safari: Voice features may vary
- Mobile: Responsive design, touch-friendly

## 🐛 Troubleshooting

### Database Issues
```bash
# Delete and recreate database
cd backend
Remove-Item database.sqlite
node testDatabase.js
```

### Port Already in Use
```bash
# Change PORT in backend/.env
PORT=3000
```

### Frontend Not Loading
```bash
# Rebuild frontend
cd frontend
npm run build
```

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🤝 Contributing

This is a complete, production-ready system. Feel free to fork and customize!

---

**Built with ❤️ for aspiring engineers**
