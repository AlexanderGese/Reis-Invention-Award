import React from 'react';
import { Trophy, Loader2 } from 'lucide-react';
import type { LeaderboardProps } from '../types';
import { LeaderboardRow } from './LeaderboardRow';
import { useTeams } from '../hooks/useTeams';

export function Leaderboard() {
  const { teams, loading, error } = useTeams();
  const sortedTeams = [...teams].sort((a, b) => b.score - a.score);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <p className="text-red-500 text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden transform hover:scale-[1.01] transition-all duration-300">
      <div className="p-8 gradient-header">
        <div className="flex items-center gap-3">
          <Trophy className="w-8 h-8 text-white" />
          <h2 className="text-3xl font-bold text-white tracking-tight">Team Leaderboard</h2>
        </div>
        <p className="mt-2 text-white/80">Ranking the best teams</p>
      </div>
      <div className="divide-y divide-gray-100">
        {sortedTeams.map((team, index) => (
          <LeaderboardRow key={team.id} team={team} index={index} />
        ))}
      </div>
    </div>
  );
}