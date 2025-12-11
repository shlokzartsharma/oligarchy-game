import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import SplashScreen from './screens/SplashScreen';
import ComplianceScreen from './screens/ComplianceScreen';
import CharacterCreationScreen from './screens/CharacterCreationScreen';
import DifficultySelectionScreen from './screens/DifficultySelectionScreen';
import ProfessionSelectionScreen from './screens/ProfessionSelectionScreen';
import MainGameScreen from './screens/MainGameScreen';
import QuizScreen from './screens/QuizScreen';
import YearSummaryScreen from './screens/YearSummaryScreen';
import RetirementScreen from './screens/RetirementScreen';
// MMO Routes
import MmoHome from './mmo/routes/MmoHome';
import MmoWorld from './mmo/routes/MmoWorld';
import MmoCompany from './mmo/routes/MmoCompany';
import MmoLeaderboard from './mmo/routes/MmoLeaderboard';
import MmoMarket from './mmo/routes/MmoMarket';
import MmoAlliances from './mmo/routes/MmoAlliances';
import MmoNews from './mmo/routes/MmoNews';
import MmoGovernment from './mmo/routes/MmoGovernment';
import MmoMedia from './mmo/routes/MmoMedia';
import MmoSeasonEnd from './mmo/routes/MmoSeasonEnd';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Quick Play Game Routes */}
        <Route path="/quick-play" element={<SplashScreen />} />
        <Route path="/quick-play/compliance" element={<ComplianceScreen />} />
        <Route path="/quick-play/character" element={<CharacterCreationScreen />} />
        <Route path="/quick-play/difficulty" element={<DifficultySelectionScreen />} />
        <Route path="/quick-play/profession" element={<ProfessionSelectionScreen />} />
        <Route path="/quick-play/game" element={<MainGameScreen />} />
        <Route path="/quick-play/quiz/:quizId" element={<QuizScreen />} />
        <Route path="/quick-play/summary" element={<YearSummaryScreen />} />
        <Route path="/quick-play/retirement" element={<RetirementScreen />} />
        
        {/* MMO Routes (under quick-play) */}
        <Route path="/quick-play/mmo" element={<MmoHome />} />
        <Route path="/quick-play/mmo/world" element={<MmoWorld />} />
        <Route path="/quick-play/mmo/company" element={<MmoCompany />} />
        <Route path="/quick-play/mmo/leaderboard" element={<MmoLeaderboard />} />
        <Route path="/quick-play/mmo/market" element={<MmoMarket />} />
        <Route path="/quick-play/mmo/alliances" element={<MmoAlliances />} />
        <Route path="/quick-play/mmo/news" element={<MmoNews />} />
        <Route path="/quick-play/mmo/government" element={<MmoGovernment />} />
        <Route path="/quick-play/mmo/media" element={<MmoMedia />} />
        <Route path="/quick-play/mmo/season-end" element={<MmoSeasonEnd />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

