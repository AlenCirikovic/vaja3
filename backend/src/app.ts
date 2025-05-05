import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route';
import imageRoutes from './routes/image.route';
import commentRoutes from './routes/comment.route';
import voteRoutes from './routes/vote.route';
import errorHandler from '../middleware/errorHandler'
import cookieParser from 'cookie-parser';
import path from 'path';
const app = express()

app.use(cors({credentials:true, origin:"http://localhost:5173"}))
app.use(express.json())
app.use(cookieParser())
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

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