import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import type { Team } from '../types';

export function useTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const teamsRef = ref(database, 'teams');
    
    const unsubscribe = onValue(teamsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          // Convert object to array and add Firebase key as id
          const teamsArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...(value as Omit<Team, 'id'>)
          }));
          setTeams(teamsArray);
        } else {
          setTeams([]);
        }
        setError(null);
      } catch (err) {
        setError('Error loading teams');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      setError('Error connecting to database');
      setLoading(false);
      console.error(error);
    });

    return () => unsubscribe();
  }, []);

  return { teams, loading, error };
}