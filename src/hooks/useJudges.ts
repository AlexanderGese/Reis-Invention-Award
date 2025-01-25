import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import type { Judge } from '../types';

export function useJudges() {
  const [judges, setJudges] = useState<Judge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const judgesRef = ref(database, 'judges');
    
    const unsubscribe = onValue(judgesRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const judgesArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...(value as Omit<Judge, 'id'>)
          }));
          setJudges(judgesArray);
        } else {
          setJudges([]);
        }
        setError(null);
      } catch (err) {
        setError('Error loading judges');
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

  return { judges, loading, error };
}