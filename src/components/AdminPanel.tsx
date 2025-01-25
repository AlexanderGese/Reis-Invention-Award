import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Users, Star } from 'lucide-react';
import { TeamForm } from './TeamForm';
import { JudgeForm } from './JudgeForm';
import { CriteriaForm } from './CriteriaForm';
import { useTeams } from '../hooks/useTeams';
import { useJudges } from '../hooks/useJudges';
import { useCriteria } from '../hooks/useCriteria';
import { useRatings } from '../hooks/useRatings';
import { deleteTeam, deleteJudge, deleteCriteria, deleteRating } from '../lib/firebase';
import { Link } from 'react-router-dom';
import type { Team, Judge, Criteria } from '../types';

export function AdminPanel() {
  const { teams, loading, error } = useTeams();
  const { judges, loading: judgesLoading, error: judgesError } = useJudges();
  const { criteria, loading: criteriaLoading, error: criteriaError } = useCriteria();
  const { ratings, loading: ratingsLoading } = useRatings();
  const [isTeamFormOpen, setIsTeamFormOpen] = useState(false);
  const [isJudgeFormOpen, setIsJudgeFormOpen] = useState(false);
  const [isCriteriaFormOpen, setIsCriteriaFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | undefined>();
  const [editingJudge, setEditingJudge] = useState<Judge | undefined>();
  const [editingCriteria, setEditingCriteria] = useState<Criteria | undefined>();
  const [activeTab, setActiveTab] = useState<'teams' | 'judges' | 'criteria' | 'ratings'>('teams');

  const handleEdit = (team: Team) => {
    setEditingTeam(team);
    setIsTeamFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await deleteTeam(id);
      } catch (error) {
        console.error('Error deleting team:', error);
      }
    }
  };

  const handleEditJudge = (judge: Judge) => {
    setEditingJudge(judge);
    setIsJudgeFormOpen(true);
  };

  const handleDeleteJudge = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this judge?')) {
      try {
        await deleteJudge(id);
      } catch (error) {
        console.error('Error deleting judge:', error);
      }
    }
  };

  const handleEditCriteria = (criteria: Criteria) => {
    setEditingCriteria(criteria);
    setIsCriteriaFormOpen(true);
  };

  const handleDeleteCriteria = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this criteria?')) {
      try {
        await deleteCriteria(id);
      } catch (error) {
        console.error('Error deleting criteria:', error);
      }
    }
  };

  const handleDeleteRating = async (ratingId: string, teamId: string) => {
    if (window.confirm('Are you sure you want to delete this rating? This will affect the team\'s score.')) {
      try {
        await deleteRating(ratingId, teamId);
      } catch (error) {
        console.error('Error deleting rating:', error);
      }
    }
  };

  const handleCloseForm = () => {
    setIsTeamFormOpen(false);
    setIsJudgeFormOpen(false);
    setIsCriteriaFormOpen(false);
    setEditingTeam(undefined);
    setEditingJudge(undefined);
    setEditingCriteria(undefined);
  };

  if (loading || judgesLoading || ratingsLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  if (isTeamFormOpen || isJudgeFormOpen || isCriteriaFormOpen) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 overflow-y-auto">
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {isTeamFormOpen && (
              <TeamForm team={editingTeam} onClose={handleCloseForm} />
            )}
            {isJudgeFormOpen && (
              <JudgeForm judge={editingJudge} onClose={handleCloseForm} />
            )}
            {isCriteriaFormOpen && (
              <CriteriaForm criteria={editingCriteria} onClose={handleCloseForm} />
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <div className="p-8 gradient-header flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'teams'
                ? 'bg-white/20 text-white font-medium shadow-lg'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Teams
          </button>
          <button
            onClick={() => setActiveTab('judges')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'judges'
                ? 'bg-white/20 text-white font-medium shadow-lg'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Judges
          </button>
          <button
            onClick={() => setActiveTab('criteria')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'criteria'
                ? 'bg-white/20 text-white font-medium shadow-lg'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Criteria
          </button>
          <button
            onClick={() => setActiveTab('ratings')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'ratings'
                ? 'bg-white/20 text-white font-medium shadow-lg'
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            Ratings
          </button>
        </div>
        {activeTab !== 'ratings' && (
          <div>
            <button
              onClick={() => 
                activeTab === 'teams' ? setIsTeamFormOpen(true) 
                : activeTab === 'judges' ? setIsJudgeFormOpen(true)
                : setIsCriteriaFormOpen(true)
              }
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-md hover:bg-white/30 transition-all duration-200 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Add {activeTab === 'teams' ? 'Team' : activeTab === 'judges' ? 'Judge' : 'Criteria'}
            </button>
          </div>
        )}
      </div>

      {activeTab === 'teams' ? (
        <div className="divide-y divide-gray-100">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-semibold">{team.name}</h3>
                  <p className="text-sm text-gray-500">Score: {team.score}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(team)}
                  className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(team.id)}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'judges' ? (
        <div className="divide-y divide-gray-100">
          {judges.map((judge) => (
            <div
              key={judge.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-semibold">{judge.name || judge.username}</h3>
                  <p className="text-sm text-gray-500">Username: {judge.username}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditJudge(judge)}
                  className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteJudge(judge.id)}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : activeTab === 'criteria' ? (
        <div className="divide-y divide-gray-100">
          {criteria.map((criterion) => (
            <div
              key={criterion.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <div>
                  <h3 className="font-semibold">{criterion.name}</h3>
                  <p className="text-sm text-gray-500">Weight: {criterion.weight}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditCriteria(criterion)}
                  className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteCriteria(criterion.id)}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {ratings.map((rating) => {
            const team = teams.find(t => t.id === rating.teamId);
            const judge = judges.find(j => j.id === rating.judgeId);
            const criterion = criteria.find(c => c.id === rating.criteriaId);
            
            if (!team || !judge || !criterion) return null;
            
            return (
              <div
                key={rating.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-900">{team.name}</h3>
                    <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium">
                      Score: {rating.score}/10
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Judge: {judge.name || judge.username}</span>
                    <span>Criteria: {criterion.name}</span>
                  </div>
                  {rating.comment && (
                    <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {rating.comment}
                    </p>
                  )}
                </div>
                <div className="ml-4">
                  <button
                    onClick={() => handleDeleteRating(rating.id, team.id)}
                    className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}