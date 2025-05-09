import { Request, Response, NextFunction } from 'express';
import prisma from '../../config/database';
import { ImageData,ImageUpdateData } from 'src/types';




export const getAllImages = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const images = await prisma.image.findMany({
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        },
        _count: {
          select: {
            comments: true,
            votes: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(images);
  } catch (error) {
    next(error);
  }
};

export const getImageById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const image = await prisma.image.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            username: true
          }
        },
        comments: {
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
        },
        votes: true
      }
    });
    
    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    // Calculate voting score
    const score = image.votes.reduce((acc, vote) => acc + vote.voteType, 0);
    
    res.json({
      ...image,
      score
    });
  } catch (error) {
    return next(error);
  }
};

export const createImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, message }: ImageData = req.body;
    const authorId = req.userId;
    
    if (!authorId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required.' });
    }
    
    const image = await prisma.image.create({
      data: {
        title,
        message,
        imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
        authorId
      }
    });
    
    
    return res.status(201).json(image);
  } catch (error) {
    return next(error);
  }
};

export const updateImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, message }: ImageUpdateData = req.body;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const existingImage = await prisma.image.findUnique({
      where: { id }
    });
    
    if (!existingImage) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    if (existingImage.authorId !== userId) {
      return res.status(403).json({ error: 'Not authorized to update this image' });
    }
    
    const updatedImage = await prisma.image.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(message !== undefined && { message })
      }
    });
    
    return res.json(updatedImage);
  } catch (error) {
    return next(error);
  }
};

export const deleteImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.userId;
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const existingImage = await prisma.image.findUnique({
      where: { id }
    });
    
    if (!existingImage) {
      return res.status(404).json({ error: 'Image not found' });
    }
    
    if (existingImage.authorId !== userId) {
      return res.status(403).json({ error: 'Not authorized to delete this image' });
    }
    
    await prisma.$transaction([
      prisma.comment.deleteMany({ where: { imageId: id } }),
      prisma.vote.deleteMany({ where: { imageId: id } }),
      prisma.image.delete({ where: { id } })
    ]);
    
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};