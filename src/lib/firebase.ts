import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, update, remove, onValue, get } from "firebase/database";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import type { Team, Judge, Criteria, Rating, SocialLinks } from '../types';

const firebaseConfig = {
  apiKey: "AIzaSyC09M5zvaoiG4ntUWWW0yMQ9ixIdrz7nTM",
  authDomain: "riaa-2afcd.firebaseapp.com",
  databaseURL: "https://riaa-2afcd-default-rtdb.firebaseio.com",
  projectId: "riaa-2afcd",
  storageBucket: "riaa-2afcd.firebasestorage.app",
  messagingSenderId: "257090434898",
  appId: "1:257090434898:web:47953655afc75c835d2c8b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);

export const loginJudge = async (username: string, password: string): Promise<Judge> => {
  const judgesRef = ref(database, 'judges');
  
  try {
    const snapshot = await get(judgesRef);
    const judges = snapshot.val();
    
    if (!judges) {
      throw new Error('Invalid credentials');
    }

    const judgeEntry = Object.entries(judges).find(
      ([_, judge]: [string, any]) => 
        judge.username === username && judge.password === password
    );

    if (!judgeEntry) {
      throw new Error('Invalid credentials');
    }

    const [id, judge] = judgeEntry;
    return {
      id,
      username: judge.username,
      password: judge.password,
      name: judge.name || judge.username // Fallback to username if name is not set
    };
  } catch (error) {
    console.error('Login error:', error);
    throw new Error('Invalid credentials');
  }
};

export const loginAdmin = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logoutAdmin = async () => {
  return signOut(auth);
};

export const addTeam = async (team: Omit<Team, 'id'>) => {
  const teamsRef = ref(database, 'teams');
  await push(teamsRef, team);
};

export const updateTeam = async (id: string, team: Partial<Team>) => {
  const teamRef = ref(database, `teams/${id}`);
  await update(teamRef, team);
};

export const deleteTeam = async (id: string) => {
  const teamRef = ref(database, `teams/${id}`);
  await remove(teamRef);
};

export const addJudge = async (judge: Omit<Judge, 'id'>) => {
  const judgesRef = ref(database, 'judges');
  await push(judgesRef, judge);
};

export const updateJudge = async (id: string, judge: Partial<Judge>) => {
  const judgeRef = ref(database, `judges/${id}`);
  await update(judgeRef, judge);
};

export const deleteJudge = async (id: string) => {
  const judgeRef = ref(database, `judges/${id}`);
  await remove(judgeRef);
};

export const addCriteria = async (criteria: Omit<Criteria, 'id'>) => {
  const criteriaRef = ref(database, 'criteria');
  await push(criteriaRef, criteria);
};

export const updateCriteria = async (id: string, criteria: Partial<Criteria>) => {
  const criteriaRef = ref(database, `criteria/${id}`);
  await update(criteriaRef, criteria);
};

export const deleteCriteria = async (id: string) => {
  const criteriaRef = ref(database, `criteria/${id}`);
  await remove(criteriaRef);
};

export const addRating = async (rating: Omit<Rating, 'id'>) => {
  const ratingsRef = ref(database, 'ratings');
  await push(ratingsRef, rating);
  await updateTeamScore(rating.teamId);
};

async function updateTeamScore(teamId: string) {
  try {
    // Get all ratings for this team
    const ratingsRef = ref(database, 'ratings');
    const ratingsSnapshot = await get(ratingsRef);
    const ratingsData = ratingsSnapshot.val() || {};
    
    // Get all criteria for weight information
    const criteriaRef = ref(database, 'criteria');
    const criteriaSnapshot = await get(criteriaRef);
    const criteriaData = criteriaSnapshot.val() || {};
    
    // Filter ratings for this team and calculate weighted average
    const teamRatings = Object.values(ratingsData).filter(
      (r: any) => r.teamId === teamId
    );
    
    if (teamRatings.length === 0) return;
    
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    teamRatings.forEach((rating: any) => {
      const criteria = criteriaData[rating.criteriaId];
      if (criteria) {
        totalWeightedScore += rating.score * criteria.weight;
        totalWeight += criteria.weight;
      }
    });
    
    // Calculate final score (0-100 scale)
    const averageScore = totalWeight > 0 
      ? Math.round((totalWeightedScore / totalWeight) * 10)
      : 0;
    
    // Update team score
    const teamRef = ref(database, `teams/${teamId}`);
    await update(teamRef, { score: averageScore });
  } catch (error) {
    console.error('Error updating team score:', error);
    throw new Error('Failed to update team score');
  }
}

export const updateSocialLinks = async (links: Partial<SocialLinks>) => {
  const socialRef = ref(database, 'social');
  await update(socialRef, links);
};

export const getSocialLinks = async (): Promise<SocialLinks | null> => {
  const socialRef = ref(database, 'social');
  const snapshot = await get(socialRef);
  return snapshot.val();
};

export const deleteRating = async (ratingId: string, teamId: string) => {
  const ratingRef = ref(database, `ratings/${ratingId}`);
  await remove(ratingRef);
  // Update team score after deleting the rating
  await updateTeamScore(teamId);
};