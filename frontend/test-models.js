const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
  try {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);
    
    // Attempt to list models or just hit an endpoint
    // Actually the SDK might not expose listModels natively in the same way, but let's try fetch directly
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error:", error);
  }
}

listModels();
