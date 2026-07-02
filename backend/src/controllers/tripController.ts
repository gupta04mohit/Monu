import { Request, Response } from 'express';
import Trip from '../models/Trip';

export const saveTrip = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { destination, startDate, endDate, budget, itinerary } = req.body;

    const newTrip = new Trip({
      userId,
      destination,
      startDate,
      endDate,
      budget,
      itinerary
    });

    const savedTrip = await newTrip.save();
    res.status(201).json(savedTrip);
  } catch (error: any) {
    res.status(500).json({ message: 'Error saving trip', error: error.message });
  }
};

export const getTrips = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const trips = await Trip.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching trips', error: error.message });
  }
};

export const getTripById = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const tripId = req.params.id;
    const trip = await Trip.findOne({ _id: tripId, userId });
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    
    res.status(200).json(trip);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching trip', error: error.message });
  }
};
