import React, { useState } from 'react';
import { MessageSquare, Star } from 'lucide-react';
import { useTeams } from '../hooks/useTeams';
import { useRatings } from '../hooks/useRatings';
import { useCriteria } from '../hooks/useCriteria';
import { useJudges } from '../hooks/useJudges';

export function TeamRankings() {
  const { teams, loading: teamsLoading } = useTeams();
  const { ratings } = useRatings();
  const { criteria } = useCriteria();
  const { judges } = useJudges();
  const [selectedTeam, setSelectedTeam] = useState<string>('');

  if (teamsLoading) {
    return <div>Loading...</div>;
  }

  const teamRatings = ratings.filter(r => r.teamId === selectedTeam);
  
  // Group ratings by criteria
  const groupedRatings = teamRatings.reduce((acc, rating) => {
    const criterion = criteria.find(c => c.id === rating.criteriaId);
    const judge = judges.find(j => j.id === rating.judgeId);
    
    if (!criterion || !judge) return acc;
    
    if (!acc[criterion.name]) {
      acc[criterion.name] = {
        weight: criterion.weight,
        ratings: []
      };
    }
    
    acc[criterion.name].ratings.push({
      judgeName: judge.name || judge.username,
      score: rating.score,
      comment: rating.comment
    });
    
    return acc;
  }, {} as Record<string, { weight: number, ratings: Array<{ judgeName: string, score: number, comment?: string }> }>);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-8 gradient-header">
        <div className="flex items-center gap-3">
          <Star className="w-8 h-8 text-white" />
          <h2 className="text-3xl font-bold text-white">Team Rankings</h2>
        </div>
        <p className="mt-2 text-white/80">Detailed scores and feedback from judges</p>
      </div>

      <div className="p-6">
        <select
          value={selectedTeam}
          onChange={(e) => setSelectedTeam(e.target.value)}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-6"
        >
          <option value="">Select your team...</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>

        {selectedTeam && Object.entries(groupedRatings).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedRatings).map(([criteriaName, { weight, ratings }]) => (
              <div key={criteriaName} className="bg-white/50 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">{criteriaName}</h3>
                  <span className="text-sm text-gray-500">Weight: {weight}</span>
                </div>
                
                <div className="space-y-4">
                  {ratings.map((rating, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{rating.judgeName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">Score:</span>
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-medium">
                            {rating.score}/10
                          </span>
                        </div>
                      </div>
                      {rating.comment && (
                        <div className="mt-2 text-gray-600 bg-gray-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            <span className="text-sm font-medium text-gray-500">Comment:</span>
                          </div>
                          {rating.comment}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : selectedTeam ? (
          <div className="text-center text-gray-500 py-8">
            No ratings available for this team yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}