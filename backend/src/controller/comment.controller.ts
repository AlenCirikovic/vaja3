import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';
import { CommentData } from '../../types';
export const getCommentsByImageId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageId } = req.params;
    
    const comments = await prisma.comment.findMany({
      where: { imageId },
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(comments);
  } catch (error) {
    next(error);
  }
};

export const createComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { imageId } = req.params;
    const { content }: CommentData = req.body;
    const authorId = req.body.authorId;
    
    if (!authorId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check if image exists
    const image = await prisma.image.findUnique({
      where: { id: imageId }
    });
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    const comment = await prisma.comment.create({
      data: {
        content,
        imageId,
        authorId
      },
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });
    
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    // Check if comment exists and user is the author
    const comment = await prisma.comment.findUnique({
      where: { id }
    });
    
    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }
    
    if (comment.authorId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this comment' });
    }
    
    await prisma.comment.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};