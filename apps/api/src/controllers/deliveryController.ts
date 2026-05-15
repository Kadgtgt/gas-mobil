import { Request, Response } from 'express';
import Delivery from '../models/Delivery';

export const getDeliveryTracking = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const delivery = await Delivery.findOne({ orderId });

    if (!delivery) {
      return res.status(404).json({ success: false, error: 'Delivery not found' });
    }

    res.json({
      success: true,
      data: delivery,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const updateDeliveryLocation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    const delivery = await Delivery.findByIdAndUpdate(
      id,
      {
        currentLocation: { latitude, longitude },
        $push: { route: { latitude, longitude } },
      },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({ success: false, error: 'Delivery not found' });
    }

    res.json({
      success: true,
      data: delivery,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
