import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createVedaOrchestrator } from './orchestrator';
import { HumanMessage } from '@langchain/core/messages';

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
}));
app.use(express.json());

let orchestrator: any = null;

app.post('/chat', async (req: Request, res: Response) => {
  try {
    const { message, sessionId } = req.body;

    if (!orchestrator) {
      orchestrator = createVedaOrchestrator();
    }

    const initialState = {
      messages: [new HumanMessage(message)],
      nextAgent: null,
      doshaProfile: null,
      currentSymptoms: [],
      healthScore: 100
    };

    console.log("AI Service: Invoking Orchestrator with message:", message);
    const finalState = await orchestrator.invoke(initialState);
    
    const lastMessage = finalState.messages[finalState.messages.length - 1];

    res.json({
      response: lastMessage.content || "I am currently processing your request.",
      routedAgent: finalState.nextAgent
    });

  } catch (error) {
    console.error("AI Service Error:", error);
    res.status(500).json({ error: 'Error processing AI request' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`AI Microservice is running on port ${PORT}`);
});
