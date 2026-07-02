import { Request, Response } from 'express';

const doctors = [
  { id: "doc1", name: "Dr. Anjali Sharma", specialty: "Ayurvedic Physician", rating: 4.9, doshaExpertise: ["PITTA", "VATA"], fee: 45 },
  { id: "doc2", name: "Dr. Vikram Singh", specialty: "Yoga Therapist", rating: 4.8, doshaExpertise: ["VATA"], fee: 40 },
  { id: "doc3", name: "Nidhi Patel", specialty: "Nutritionist", rating: 4.7, doshaExpertise: ["KAPHA"], fee: 35 },
];

export const matchDoctor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { primaryDosha, symptoms } = req.body;

    // AI Matching: rank doctors by Dosha expertise
    const ranked = doctors
      .map(doc => ({
        ...doc,
        matchScore: doc.doshaExpertise.includes(primaryDosha) ? 98 : 70,
      }))
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json({ doctors: ranked });
  } catch (error) {
    res.status(500).json({ message: 'AI matching error' });
  }
};

export const bookAppointment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { doctorId, patientId, scheduledAt } = req.body;

    // In production, this would write to DB and trigger a payment flow
    const meetingLink = `https://vedaai.health/consult/${Date.now()}`;

    res.json({
      success: true,
      appointment: {
        doctorId,
        patientId,
        scheduledAt,
        status: "CONFIRMED",
        meetingLink
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Booking error' });
  }
};

export const getWearableMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;

    // Mock wearable data — in production, fetched from Google Fit/Apple Health OAuth
    const metrics = {
      heartRate: [
        { time: '08:00', value: 65 }, { time: '10:00', value: 72 },
        { time: '12:00', value: 115 }, { time: '14:00', value: 78 },
        { time: '16:00', value: 75 }, { time: '18:00', value: 70 },
      ],
      spO2: 98,
      steps: 7823,
      sleepHours: 6.5,
      deepSleepHours: 2.25,
      stressScore: 42,
      caloriesBurned: 520,
      lastSynced: new Date().toISOString()
    };

    res.json({ userId, metrics });
  } catch (error) {
    res.status(500).json({ message: 'Wearable data error' });
  }
};
