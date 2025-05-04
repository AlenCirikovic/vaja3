import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';
import { VoteData } from '../../types';

export const voteImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageId } = req.params;
    const { voteType }: VoteData = req.body; // 1 for like, -1 for dislike
    const userId = req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check if image exists
    const image = await prisma.image.findUnique({
      where: { id: imageId }
    });
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // Check if user has already voted on this image
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_imageId: {
          userId,
          imageId
        }
      }
    });
    
    if (existingVote) {
      // Update existing vote
      if (existingVote.voteType === voteType) {
        // If voting the same way, remove the vote
        await prisma.vote.delete({
          where: {
            id: existingVote.id
          }
        });
        res.json({ message: 'Vote removed' });
      } else {
        // Change vote
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
      // Create new vote
      const newVote = await prisma.vote.create({
        data: {
          voteType,
          userId,
          imageId
        }
      });
      res.status(201).json(newVote);
    }
  } catch (error) {
    next(error);
  }
};

export const getVoteStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageId } = req.params;
    const userId = req.body.userId;
    
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
    
    res.json({ voteStatus: vote ? vote.voteType : 0 });
  } catch (error) {
    next(error);
  }
};
