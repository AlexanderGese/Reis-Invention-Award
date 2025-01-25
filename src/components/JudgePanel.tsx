import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { loginJudge } from '../lib/firebase';

export function JudgePanel() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const judge = await loginJudge(username, password);
      sessionStorage.setItem('judge', JSON.stringify(judge));
      navigate('/judge/rate');
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-8 w-full max-w-md mx-auto transform hover:scale-[1.01] transition-all duration-300">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Judge Login</h2>
        <p className="text-gray-400">Access your judging dashboard</p>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 text-red-400 rounded-lg text-sm font-medium border border-red-500/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 btn-primary py-3 text-lg"
        >
          <LogIn className="w-4 h-4" />
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}