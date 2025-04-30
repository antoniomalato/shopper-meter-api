import { Request, Response } from 'express';

export const uploadMeasure = async (req: Request, res: Response) => {
  return res.status(200).json({ message: 'upload ok' });
};

export const confirmMeasure = async (req: Request, res: Response) => {
  return res.status(200).json({ message: 'confirm ok' });
};

export const listMeasures = async (req: Request, res: Response) => {
  return res.status(200).json({ message: 'list ok' });
};
