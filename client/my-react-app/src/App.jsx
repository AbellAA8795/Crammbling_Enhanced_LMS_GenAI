import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Registration from './pages/Registration.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Chatbot from './pages/chatbot.jsx';
import Personalized from './pages/personalized.jsx';
import GroupCollab from './pages/group_collab.jsx';

// The chatbot / group collab / personalized pages call onNavigate(key) with
// these keys from their sidebars. Each key maps to a route.
const PATHS = {
  dashboard: '/dashboard',
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

// Placeholder until the Quiz Arena page exists.
function QuizArenaPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-deep text-ink font-display">
      <p className="label">Quiz Arena is coming soon</p>
      <button type="button" className="btn btn-cyan" onClick={() => navigate('/dashboard')}>
        Back to Dashboard
      </button>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/group-collab" element={<GroupCollabPage />} />
        <Route path="/personalized" element={<PersonalizedPage />} />
        <Route path="/quiz-arena" element={<QuizArenaPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;