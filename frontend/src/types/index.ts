export interface UserPayload {
    id: string;
    username: string;
    email: string;
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData {
    username: string;
    email: string;
    password: string;
  }
  
  export interface ImageData {
    title: string;
    message?: string;
    imageUrl: File | null;
  }
  
  
  export interface ImageUpdateData {
    title?: string;
    message?: string;
  }
  
  export interface CommentData {
    content: string;
  }
  
  export interface VoteData {
    voteType: number; // 1 for like, -1 for dislike
  }
  
  export interface Image {
    id: string;
    title: string;
    message?: string;
    imageUrl: string;
    createdAt: string;
    author: {
      id: string;
      username: string;
    };
    _count: {
      comments: number;
      votes: number;
    };
  }
  
  export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      username: string;
    };
  }
  
  export interface ImageDetail extends Image {
    comments: Comment[];
    votes: { id: string; voteType: number }[];
    score: number;
  }