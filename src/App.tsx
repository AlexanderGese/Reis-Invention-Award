import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Leaderboard } from './components/Leaderboard';
import { AdminPanel } from './components/AdminPanel';
import { JudgePanel } from './components/JudgePanel';
import { RatingPanel } from './components/RatingPanel';
import { SocialMenu } from './components/SocialMenu';
import { TeamComments } from './components/TeamComments';
import { TeamRankings } from './components/TeamRankings';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { DarkModeSwitch } from './components/DarkModeSwitch';

export default function App() {
  return (
    <DarkModeProvider>
      <BrowserRouter>
        <DarkModeSwitch />
        <SocialMenu />
        <div className="min-h-screen p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-black dark:via-black dark:to-black transition-colors duration-200">
          <div className="max-w-2xl mx-auto space-y-8">
            <Routes>
              <Route path="/" element={<Leaderboard />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/judge" element={<JudgePanel />} />
              <Route path="/judge/rate" element={<RatingPanel />} />
              <Route path="/comments" element={<TeamComments />} />
              <Route path="/ranking" element={<TeamRankings />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </DarkModeProvider>
  );
}