import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import type { Rating } from '../types';

export function useRatings() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ratingsRef = ref(database, 'ratings');
    
    const unsubscribe = onValue(ratingsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const ratingsArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...(value as Omit<Rating, 'id'>)
          }));
          setRatings(ratingsArray);
        } else {
          setRatings([]);
        }
        setError(null);
      } catch (err) {
        setError('Error loading ratings');
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { ratings, loading, error };
}