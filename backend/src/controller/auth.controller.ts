import { Request, Response, NextFunction } from "express";
import { Express } from "express";
import bcrypt from 'bcrypt'
import prisma from "../../config/database";
import { LoginCredentials, RegisterData, UserPayload } from "../../types";
import jwt from "jsonwebtoken";


export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password }: RegisterData = req.body
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });

        const token = jwt.sign({ id: (await user).id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });


        const userPayLoad: UserPayload = {
            id: (await user).id,
            username: (await user).username,
            email: (await user).email,
        }


        res.status(201).json({
            user: userPayLoad,
            token
        });

    } catch (error) {
        next(error);
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

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '7d' });

        const userPayload: UserPayload = {
            id: user.id,
            username: user.username,
            email: user.email
        };

        res.json({
            user: userPayload,
            token
        });
    } catch (error) {
        next(error);
    }
};