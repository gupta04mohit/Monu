import { Request, Response } from 'express';

export const chatWithVeda = async (req: Request, res: Response): Promise<void> => {
  try {
    const { message, sessionId } = req.body;

    console.log("Backend: Forwarding request to AI Microservice...");
    
    // Call the external AI Microservice running on port 5001
    const aiResponse = await fetch('http://localhost:5001/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId })
    });

    if (!aiResponse.ok) {
      throw new Error(`AI Service returned ${aiResponse.status}`);
    }

    const data = await aiResponse.json();
    res.json(data);

  } catch (error) {
    console.error("AI Chat Forwarding Error:", error);
    res.status(500).json({ message: 'Error processing AI request' });
  }
};
