import { Request, Response, NextFunction } from 'express';
import { Prisma } from '../generated/prisma';

const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  
  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Unique constraint violation' });
    }
    return res.status(400).json({ error: 'Database error', details: err.message });
  }
  
  res.status(500).json({ error: 'Something went wrong on our end' });
};

export default errorHandler;