import React from 'react';
import { Trophy } from 'lucide-react';
import type { Team } from '../types';

interface LeaderboardRowProps {
  team: Team;
  index: number;
}

export function LeaderboardRow({ team, index }: LeaderboardRowProps) {
  return (
    <div className="flex items-center p-6 hover:bg-white/50 transition-all duration-200">
      <div className="w-16 text-2xl font-bold">
        <span className={`${index < 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
          #{index + 1}
        </span>
      </div>
      <div className="flex items-center flex-1">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
          {index === 0 && (
            <Trophy className="w-5 h-5 text-yellow-400 animate-pulse" />
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-indigo-50 rounded-lg">
          <span className="text-2xl font-bold text-indigo-600">{team.score}</span>
          <span className="ml-1 text-sm text-indigo-400">/100</span>
        </div>
      </div>
    </div>
  );
}