import { StateGraph, END, START } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage, BaseMessage } from "@langchain/core/messages";

// 1. Define the State Structure
export interface AgentState {
  messages: BaseMessage[];
  nextAgent: string | null;
  doshaProfile: any;
  currentSymptoms: string[];
  healthScore: number;
}

// 2. Initialize LLM
const llm = new ChatOpenAI({
  modelName: "gpt-4-turbo",
  temperature: 0,
});

// 3. Define the Master Orchestrator Node
const orchestratorNode = async (state: AgentState) => {
  console.log("--- MASTER ORCHESTRATOR ---");
  const lastMessage = state.messages[state.messages.length - 1].content;
  
  const systemPrompt = new SystemMessage(
    `You are the Master Orchestrator of VedaAI, an advanced Preventive Healthcare Operating System.
    Based on the user's latest input, route to the most appropriate specialized agent.
    
    Available Agents:
    - "dosha_agent": Body constitution, Vata/Pitta/Kapha.
    - "symptom_agent": Current physical/mental symptoms.
    - "disease_forecast_agent": Predicting disease risks from habits.
    - "longevity_agent": Biological age, life expectancy, anti-aging.
    - "diet_agent": Meal planning.
    - "food_analysis_agent": Scanning/analyzing food images for calories/Dosha.
    - "voice_analysis_agent": Analyzing voice for stress/fatigue.
    - "face_analysis_agent": Analyzing face for skin/hydration.
    - "coach_agent": Motivation, habits, sleep.
    - "research_agent": General Ayurvedic texts lookup.
    - "knowledge_graph_agent": Deep root-cause reasoning across diseases/herbs/Doshas.
    - "preventive_care_agent": Proactive alerts before symptoms appear.
    - "budget_planner_agent": Planning budgets for travel and wellness trips.
    - "hotel_recommendation_agent": Recommending hotels and wellness resorts.
    - "flight_recommendation_agent": Recommending flights and travel routes.
    - "weather_agent": Providing weather forecasts for destinations.
    
    Respond ONLY with the exact name of the agent to route to.`
  );

  const response = await llm.invoke([systemPrompt, new HumanMessage(lastMessage as string)]);
  const nextAgent = response.content.toString().trim().toLowerCase();
  
  console.log(`[Orchestrator] Routing to: ${nextAgent}`);
  return { nextAgent };
};

// 4. Define Specialized Agents (12 in total)

const doshaAgentNode = async (state: AgentState) => {
  const prompt = new SystemMessage(`You are the Dosha Expert Agent. Analyze from Vata, Pitta, Kapha perspective.`);
  return { messages: [await llm.invoke([prompt, ...state.messages])] };
};

const symptomAgentNode = async (state: AgentState) => {
  const prompt = new SystemMessage(`You are the Symptom Analysis Agent. Evaluate symptoms for early imbalances.`);
  return { messages: [await llm.invoke([prompt, ...state.messages])] };
};

const diseaseForecastAgentNode = async (state: AgentState) => {
  const prompt = new SystemMessage(`You are the Disease Forecast Agent. Predict long-term risks (Diabetes, Heart Disease) based on inputs.`);
  return { messages: [await llm.invoke([prompt, ...state.messages])] };
};

const longevityAgentNode = async (state: AgentState) => {
  const prompt = new SystemMessage(`You are the Longevity Engine Agent. Calculate Biological Age and provide anti-aging insights.`);
  return { messages: [await llm.invoke([prompt, ...state.messages])] };
};

const dietAgentNode = async (state: AgentState) => {
  const prompt = new SystemMessage(`You are the Smart Diet Agent. Generate Dosha-pacifying meal plans.`);
  return { messages: [await llm.invoke([prompt, ...state.messages])] };
};

const foodAnalysisAgentNode = async (state: AgentState) => {
  const prompt = new SystemMessage(`You are the Food Analysis Agent. In a real environment, you would use Computer Vision to analyze the uploaded food image for calories and Dosha compatibility. For now, simulate this analysis.`);
  return { messages: [await llm.invoke([prompt, ...state.messages])] };
};

const voiceAnalysisAgentNode = async (state: AgentState) => {
  const prompt = new SystemMessage(`You are the Voice Analysis Agent. Simulate analysis of vocal biomarkers for stress and fatigue.`);
  return { messages: [await llm.invoke([prompt, ...state.messages])] };
};

const faceAnalysisAgentNode = async (state: AgentState) => {
  const prompt = new SystemMessage(`You are the Face Analysis Agent. Simulate computer vision analysis of facial skin health and hydration.`);
  return { messages: [await llm.invoke([prompt, ...state.messages])] };
};

const coachAgentNode = async (state: AgentState) => {
  const prompt = new SystemMessage(`You are the AI Health Coach ("Veda" Avatar). Provide daily motivation and habit tracking.`);
  return { messages: [await llm.invoke([prompt, ...state.messages])] };
};

const researchAgentNode = async (state: AgentState) => {
  const prompt = new SystemMessage(`You are the Ayurvedic Research Agent. Provide textbook-backed answers.`);
  return { messages: [await llm.invoke([prompt, ...state.messages])] };
};

const knowledgeGraphAgentNode = async (state: AgentState) => {
  const prompt = new SystemMessage(`You are the Knowledge Graph Agent. Traverse semantic relationships between diseases, herbs, and Doshas to find root causes.`);
  return { messages: [await llm.invoke([prompt, ...state.messages])] };
};

const preventiveCareAgentNode = async (state: AgentState) => {
  const prompt = new SystemMessage(`You are the Preventive Care Agent. Generate proactive warnings before symptoms appear.`);
  return { messages: [await llm.invoke([prompt, ...state.messages])] };
};

const budgetPlannerAgentNode = async (state: AgentState) => {
  const prompt = new SystemMessage(`You are the Gemini Budget Planner Agent. You help users plan their budget for wellness trips and travel. Analyze their itinerary and provide cost estimations.`);
  return { messages: [await llm.invoke([prompt, ...state.messages])] };
};

const hotelRecommendationAgentNode = async (state: AgentState) => {
  const prompt = new SystemMessage(`You are the Hotel Recommendation Agent. You recommend wellness resorts, retreats, and hotels based on the user's destination, budget, and Dosha needs.`);
  return { messages: [await llm.invoke([prompt, ...state.messages])] };
};

const flightRecommendationAgentNode = async (state: AgentState) => {
  const prompt = new SystemMessage(`You are the Flight Recommendation Agent. You suggest flight routes, airlines, and estimates for travel planning.`);
  return { messages: [await llm.invoke([prompt, ...state.messages])] };
};

const weatherAgentNode = async (state: AgentState) => {
  const prompt = new SystemMessage(`You are the Weather Agent. Provide weather forecasts, seasonal advice, and optimal travel times for destinations.`);
  return { messages: [await llm.invoke([prompt, ...state.messages])] };
};

// 5. Conditional Routing Logic
const routeFromOrchestrator = (state: AgentState) => {
  const agentMap = [
    "dosha_agent", "symptom_agent", "disease_forecast_agent", "longevity_agent", 
    "diet_agent", "food_analysis_agent", "voice_analysis_agent", "face_analysis_agent", 
    "coach_agent", "research_agent", "knowledge_graph_agent", "preventive_care_agent",
    "budget_planner_agent", "hotel_recommendation_agent", "flight_recommendation_agent", "weather_agent"
  ];
  if (state.nextAgent && agentMap.includes(state.nextAgent)) {
    return state.nextAgent;
  }
  return "coach_agent"; // Fallback
};

// 6. Build the LangGraph
export const createVedaOrchestrator = () => {
  
  const graphState = {
    messages: {
      value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
      default: () => [],
    },
    nextAgent: {
      value: (x: string | null, y: string | null) => y ?? x,
      default: () => null,
    },
    doshaProfile: {
      value: (x: any, y: any) => y ?? x,
      default: () => null,
    },
    currentSymptoms: {
      value: (x: string[], y: string[]) => x.concat(y),
      default: () => [],
    },
    healthScore: {
      value: (x: number, y: number) => y ?? x,
      default: () => 100,
    }
  };

  const workflow = new StateGraph({ channels: graphState as any });

  // Add Nodes
  workflow.addNode("orchestrator", orchestratorNode);
  workflow.addNode("dosha_agent", doshaAgentNode);
  workflow.addNode("symptom_agent", symptomAgentNode);
  workflow.addNode("disease_forecast_agent", diseaseForecastAgentNode);
  workflow.addNode("longevity_agent", longevityAgentNode);
  workflow.addNode("diet_agent", dietAgentNode);
  workflow.addNode("food_analysis_agent", foodAnalysisAgentNode);
  workflow.addNode("voice_analysis_agent", voiceAnalysisAgentNode);
  workflow.addNode("face_analysis_agent", faceAnalysisAgentNode);
  workflow.addNode("coach_agent", coachAgentNode);
  workflow.addNode("research_agent", researchAgentNode);
  workflow.addNode("knowledge_graph_agent", knowledgeGraphAgentNode);
  workflow.addNode("preventive_care_agent", preventiveCareAgentNode);
  workflow.addNode("budget_planner_agent", budgetPlannerAgentNode);
  workflow.addNode("hotel_recommendation_agent", hotelRecommendationAgentNode);
  workflow.addNode("flight_recommendation_agent", flightRecommendationAgentNode);
  workflow.addNode("weather_agent", weatherAgentNode);

  // Define Edges
  workflow.addEdge(START, "orchestrator" as any);
  
  workflow.addConditionalEdges(
    "orchestrator" as any,
    routeFromOrchestrator as any,
    {
      dosha_agent: "dosha_agent",
      symptom_agent: "symptom_agent",
      disease_forecast_agent: "disease_forecast_agent",
      longevity_agent: "longevity_agent",
      diet_agent: "diet_agent",
      food_analysis_agent: "food_analysis_agent",
      voice_analysis_agent: "voice_analysis_agent",
      face_analysis_agent: "face_analysis_agent",
      coach_agent: "coach_agent",
      research_agent: "research_agent",
      knowledge_graph_agent: "knowledge_graph_agent",
      preventive_care_agent: "preventive_care_agent",
      budget_planner_agent: "budget_planner_agent",
      hotel_recommendation_agent: "hotel_recommendation_agent",
      flight_recommendation_agent: "flight_recommendation_agent",
      weather_agent: "weather_agent"
    } as any
  );

  const agents = [
    "dosha_agent", "symptom_agent", "disease_forecast_agent", "longevity_agent", 
    "diet_agent", "food_analysis_agent", "voice_analysis_agent", "face_analysis_agent", 
    "coach_agent", "research_agent", "knowledge_graph_agent", "preventive_care_agent",
    "budget_planner_agent", "hotel_recommendation_agent", "flight_recommendation_agent", "weather_agent"
  ];

  agents.forEach(agent => workflow.addEdge(agent as any, END));

  return workflow.compile();
};
