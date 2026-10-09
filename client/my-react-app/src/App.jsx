import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Registration from './pages/Registration.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Chatbot from './pages/chatbot.jsx';
import Personalized from './pages/personalized.jsx';
import GroupCollab from './pages/group_collab.jsx';
import QuizArena from './pages/QuizArena.jsx';
import Classroom from './pages/classroom.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import TeacherClassroom from './pages/TeacherClassroom.jsx';
import TeacherChatbot from './pages/TeacherChatbot.jsx';
import TeacherMessenger from './pages/TeacherMessenger';
import TeacherProfile from './pages/TeacherProfile';
import TeacherPersonalized from './pages/TeacherPersonalized';
import TeacherLogout from './pages/TeacherLogout';

import { useTheme } from './pages/Theme';
import { ProfileProvider, ProfileHost } from './components/ProfileSystem';

const PATHS = {
  dashboard: '/dashboard',
  classroom: '/classroom',
  chatbot: '/chatbot',
  group: '/group-collab',
  personalized: '/personalized',
  quiz: '/quiz-arena',
};

function ChatbotPage() {
  const navigate = useNavigate();
  return <Chatbot onNavigate={(key) => navigate(PATHS[key] ?? '/dashboard')} />;
}

function GroupCollabPage() {
  const navigate = useNavigate();
  return <GroupCollab onNavigate={(key) => navigate(PATHS[key] ?? '/dashboard')} />;
}

function PersonalizedPage() {
  const navigate = useNavigate();
  return (
    <Personalized
      onNavigateToDashboard={() => navigate('/dashboard')}
      onNavigateToChatbot={() => navigate('/chatbot')}
      onNavigateToGroup={() => navigate('/group-collab')}
    />
  );
}

function QuizArenaPage() {
  const navigate = useNavigate();
  return <QuizArena where="Quiz Forge" onBack={() => navigate('/personalized')} />;
}

function ClassroomPage() {
  const navigate = useNavigate();
  return <Classroom onNavigate={(key) => navigate(PATHS[key] ?? '/dashboard')} />;
}

function App() {
  const [, , rootThemeStyle] = useTheme();

  return (
    <BrowserRouter>
      <ProfileProvider>
        <div style={rootThemeStyle} className="min-h-screen bg-[var(--t-bg0)] text-[color:var(--t-tx0)]">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/classroom" element={<ClassroomPage />} />
            <Route path="/chatbot" element={<ChatbotPage />} />
            <Route path="/group-collab" element={<GroupCollabPage />} />
            <Route path="/personalized" element={<PersonalizedPage />} />
            <Route path="/quiz-arena" element={<QuizArenaPage />} />

            {/* Teacher routes */}
            <Route path="/teacher"              element={<TeacherDashboard />} />
            <Route path="/teacher/classroom"    element={<TeacherClassroom />} />
            <Route path="/teacher/chatbot"      element={<TeacherChatbot />} />
            <Route path="/teacher/messenger"    element={<TeacherMessenger />} />
            <Route path="/teacher/profile"      element={<TeacherProfile />} />
            <Route path="/teacher/personalized" element={<TeacherPersonalized />} />
          </Routes>

          <ProfileHost groups={[]} />
        </div>
      </ProfileProvider>
    </BrowserRouter>
  );
}

export default App;