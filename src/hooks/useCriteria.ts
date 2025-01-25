import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import type { Criteria } from '../types';

export function useCriteria() {
  const [criteria, setCriteria] = useState<Criteria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const criteriaRef = ref(database, 'criteria');
    
    const unsubscribe = onValue(criteriaRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          const criteriaArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...(value as Omit<Criteria, 'id'>)
          }));
          setCriteria(criteriaArray);
        } else {
          setCriteria([]);
        }
        setError(null);
      } catch (err) {
        setError('Error loading criteria');
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { criteria, loading, error };
}