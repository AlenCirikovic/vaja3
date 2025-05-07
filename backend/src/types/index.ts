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
    imageUrl: string;
  }
  
  export interface ImageUpdateData {
    title?: string;
    message?: string;
  }
  
  export interface CommentData {
    content: string;
  }
  
  export interface VoteData {
    voteType: number; 
  }
