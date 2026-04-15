import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QuizProvider } from './context/QuizContext';
import Home from './pages/Home';
import FlashcardPhase from './pages/FlashcardPhase';
import Phase3 from './pages/Phase3';
import Phase4 from './pages/Phase4';
import Results from './pages/Results';

export default function App() {
  return (
    <QuizProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/phase/1" element={<FlashcardPhase phaseKey="phase1" direction="name-to-formula" />} />
          <Route path="/phase/2" element={<FlashcardPhase phaseKey="phase2" direction="formula-to-name" />} />
          <Route path="/phase/3" element={<Phase3 />} />
          <Route path="/phase/4" element={<Phase4 />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QuizProvider>
  );
}
