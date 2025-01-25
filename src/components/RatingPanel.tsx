import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Save, LogOut } from 'lucide-react';
import { useTeams } from '../hooks/useTeams';
import { useCriteria } from '../hooks/useCriteria';
import { useSubmittedRatings } from '../hooks/useSubmittedRatings';
import { addRating } from '../lib/firebase';
import type { Team, Judge } from '../types';

export function RatingPanel() {
  const navigate = useNavigate();
  const { teams, loading: teamsLoading } = useTeams();
  const { criteria, loading: criteriaLoading } = useCriteria();
  const [selectedTeam, setSelectedTeam] = useState<string>('');
  const [scores, setScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Get judge from session storage
  const judgeData = sessionStorage.getItem('judge');
  const judge: Judge = judgeData ? JSON.parse(judgeData) : null;

  // Get submitted teams for this judge
  const { submittedTeams, loading: submittedLoading } = useSubmittedRatings(judge?.id || '');

  useEffect(() => {
    if (!judge) {
      navigate('/judge');
    }
  }, [judge, navigate]);

  const handleScoreChange = (criteriaId: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [criteriaId]: score
    }));
  };

  const handleCommentChange = (criteriaId: string, comment: string) => {
    setComments(prev => ({
      ...prev,
      [criteriaId]: comment
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !judge) return;

    setSaving(true);
    try {
      // Validate that all criteria have scores
      const missingScores = criteria.some(c => !scores[c.id]);
      if (missingScores) {
        throw new Error('Please provide scores for all criteria');
      }

      // Submit a rating for each criteria
      await Promise.all(
        criteria.map(criterion =>
          addRating({
            teamId: selectedTeam,
            judgeId: judge.id,
            criteriaId: criterion.id,
            score: scores[criterion.id],
            comment: comments[criterion.id]?.trim() || ''
          })
        )
      );
      
      // Reset form
      setSelectedTeam('');
      setScores({});
      setComments({});
      alert('Ratings submitted successfully!');
    } catch (error) {
      console.error('Error submitting ratings:', error);
      alert(error instanceof Error ? error.message : 'Error submitting ratings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('judge');
    navigate('/judge');
  };

  if (teamsLoading || criteriaLoading || submittedLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  // Filter out teams that have already been rated by this judge
  const availableTeams = teams.filter(team => !submittedTeams.includes(team.id));

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Rate Teams</h2>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
        <p className="mt-2 text-white/80">Logged in as {judge?.name || judge?.username}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Team
          </label>
          {availableTeams.length > 0 ? (
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Choose a team...</option>
              {availableTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded-lg text-gray-500">
              You have rated all available teams!
            </div>
          )}
        </div>

        {selectedTeam && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-900">Criteria</h3>
            {criteria.map((criterion) => (
              <div key={criterion.id} className="bg-gray-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {criterion.name}
                </label>
                <p className="text-xs text-gray-500 mb-2">Weight: {criterion.weight}</p>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={scores[criterion.id] || ''}
                  onChange={(e) => 
                    handleScoreChange(criterion.id, parseInt(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                  placeholder="Score (0-10, 10 being the best)"
                />
                <textarea
                  value={comments[criterion.id] || ''}
                  onChange={(e) => handleCommentChange(criterion.id, e.target.value)}
                  placeholder="Add your comments here..."
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 h-24 resize-none"
                />
              </div>
            ))}

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Submit Ratings'}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}