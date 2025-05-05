import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt'
import prisma from "../../config/database";
import { LoginCredentials, RegisterData, UserPayload } from 'src/types'
import jwt from "jsonwebtoken";


export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, email, password }: RegisterData = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });


    const userPayload: UserPayload = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    return res.status(201).json({
      user: userPayload,
    });
  } catch (error) {
    return next(error);
  }
};



export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password }: LoginCredentials = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });

        res.cookie('token',token,{
          httpOnly:true
        })

        const userPayload: UserPayload = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        return res.json({
            user: userPayload,
        });
    } catch (error) {
        return next(error);
    }
};

export const signout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Clear the token cookie
    res.clearCookie('token');

    console.log(`User ${userId} signed out`);
    return res.status(200).json({ message: 'Successfully signed out' });
  } catch (error) {
    return next(error);
  }
};