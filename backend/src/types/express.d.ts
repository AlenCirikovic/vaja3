import express from 'express';

declare global {
  namespace Express {
    // Extend request interface
    interface Request {
      userId: string;
    }
  }
}