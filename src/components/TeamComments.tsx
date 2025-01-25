import React, { useState } from 'react';
import { useTeams } from '../hooks/useTeams';
import { useRatings } from '../hooks/useRatings';
import { useCriteria } from '../hooks/useCriteria';
import { MessageSquare } from 'lucide-react';

export function TeamComments() {
  const { teams, loading: teamsLoading } = useTeams();
  const { ratings } = useRatings();
  const { criteria } = useCriteria();
  const [selectedTeam, setSelectedTeam] = useState<string>('');

  if (teamsLoading) {
    return <div>Loading...</div>;
  }

  const teamRatings = ratings.filter(r => r.teamId === selectedTeam);
  const groupedComments = teamRatings.reduce((acc, rating) => {
    const criterion = criteria.find(c => c.id === rating.criteriaId);
    if (!criterion) return acc;
    
    if (!acc[criterion.name]) {
      acc[criterion.name] = [];
    }
    if (rating.comment) {
      acc[criterion.name].push(rating.comment);
    }
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-8 gradient-header">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-white" />
          <h2 className="text-3xl font-bold text-white">Team Comments</h2>
        </div>
        <p className="mt-2 text-white/80">View feedback from judges</p>
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

        {selectedTeam && Object.entries(groupedComments).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedComments).map(([criteriaName, comments]) => (
              <div key={criteriaName} className="bg-white/50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{criteriaName}</h3>
                <div className="space-y-2">
                  {comments.map((comment, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg text-gray-700">
                      {comment}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : selectedTeam ? (
          <div className="text-center text-gray-500 py-8">
            No comments available for this team yet.
          </div>
        ) : null}
      </div>
    </div>
  );
}