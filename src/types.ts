export interface Team {
  id: string;
  name: string;
  score: number;
}

export interface Judge {
  id: string;
  username: string;
  password: string;
  name: string;
}

export interface Criteria {
  id: string;
  name: string;
  weight: number;
}

export interface Rating {
  id: string;
  teamId: string;
  judgeId: string;
  criteriaId: string;
  score: number;
  comment?: string;
}

export interface SocialLinks {
  id: string;
  github?: string;
  kofi?: string;
  website?: string;
  linkedin?: string;
}