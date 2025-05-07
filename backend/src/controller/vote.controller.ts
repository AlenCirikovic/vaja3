import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';
import { VoteData } from 'src/types';

export const voteImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageId } = req.params;
    const { voteType }: VoteData = req.body; 
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const image = await prisma.image.findUnique({
      where: { id: imageId }
    });
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_imageId: {
          userId,
          imageId
        }
      }
    });
    
    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await prisma.vote.delete({
          where: {
            id: existingVote.id
          }
        });
        res.json({ message: 'Vote removed' });
      } else {
        const updatedVote = await prisma.vote.update({
          where: {
            id: existingVote.id
          },
          data: {
            voteType
          }
        });
        res.json(updatedVote);
      }
    } else {
      const newVote = await prisma.vote.create({
        data: {
          voteType,
          userId,
          imageId
        }
      });
      return res.status(201).json(newVote);
    }
  } catch (error) {
    return next(error);
  }
};

export const getVoteStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageId } = req.params;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const vote = await prisma.vote.findUnique({
      where: {
        userId_imageId: {
          userId,
          imageId
        }
      }
    });
    
    return res.json({ voteStatus: vote ? vote.voteType : 0 });
  } catch (error) {
    return next(error);
  }
};
