import { Request, Response } from 'express';
import Cylinder from '../models/Cylinder';

export const getCylinders = async (req: Request, res: Response) => {
  try {
    const cylinders = await Cylinder.find({ available: { $gt: 0 } });

    res.json({
      success: true,
      data: cylinders,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getCylinderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cylinder = await Cylinder.findById(id);

    if (!cylinder) {
      return res.status(404).json({ success: false, error: 'Cylinder not found' });
    }

    res.json({
      success: true,
      data: cylinder,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
