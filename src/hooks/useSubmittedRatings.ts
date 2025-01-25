import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import type { Rating } from '../types';

export function useSubmittedRatings(judgeId: string) {
  const [submittedTeams, setSubmittedTeams] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!judgeId) return;

    const ratingsRef = ref(database, 'ratings');
    
    const unsubscribe = onValue(ratingsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          // Get all ratings for this judge and extract unique team IDs
          const ratings = Object.values(data) as Rating[];
          const teamIds = [...new Set(
            ratings
              .filter(r => r.judgeId === judgeId)
              .map(r => r.teamId)
          )];
          setSubmittedTeams(teamIds);
        } else {
          setSubmittedTeams([]);
        }
      } catch (err) {
        console.error('Error loading submitted ratings:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [judgeId]);

  return { submittedTeams, loading };
}