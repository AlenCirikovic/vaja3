import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      userId: string;
    }
  }
}

const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies.token
    if (!token) {
      console.log('No token found, authentication required');
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
      console.log('Token verified successfully, user ID:', decoded.id);
      req.userId = decoded.id;
      next();
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ error: 'Authentication failed' });
    return;
  }
};

export default auth;