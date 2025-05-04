import express, { Express, Request, Response , Application } from 'express';
import { PrismaClient } from '../generated/prisma';
import cors from 'cors'
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route';
import imageRoutes from './routes/image.route';
import commentRoutes from './routes/comment.route';
import voteRoutes from './routes/vote.route';
import errorHandler from '../middleware/errorHandler';

const app = express()

app.use(cors())
app.use(express.json())

const PORT: number = 3000

app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/votes', voteRoutes);

app.use(errorHandler);

dotenv.config();

app.listen(process.env.PORT_BACKEND || 3000,()=>{
    console.log(`Server connected on port ${PORT}`)
})



export default app;