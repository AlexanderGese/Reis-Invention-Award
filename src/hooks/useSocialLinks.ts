import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../lib/firebase';
import type { SocialLinks } from '../types';

export function useSocialLinks() {
  const [links, setLinks] = useState<SocialLinks | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socialRef = ref(database, 'social');
    
    const unsubscribe = onValue(socialRef, (snapshot) => {
      try {
        const data = snapshot.val();
        setLinks(data);
        setError(null);
      } catch (err) {
        setError('Error loading social links');
        console.error(err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { links, loading, error };
}