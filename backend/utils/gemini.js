const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'placeholder_api_key');

// Helper to convert image URL to Generative Part
async function urlToGenerativePart(imageUrl) {
  try {
    // Handle base64 data URI sent from frontend preview
    if (imageUrl.startsWith('data:')) {
      const match = imageUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/);
      if (match) {
        return {
          inlineData: {
            data: match[2],
            mimeType: match[1]
          }
        };
      }
    }

    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Attempt to guess mime type from URL or default to jpeg
    let mimeType = "image/jpeg";
    if (imageUrl.toLowerCase().endsWith('.png')) mimeType = "image/png";
    else if (imageUrl.toLowerCase().endsWith('.webp')) mimeType = "image/webp";

    return {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType
      },
    };
  } catch (error) {
    console.error("Error fetching image for Gemini:", error);
    throw error;
  }
}

async function generateDescription(title, imageUrl) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Write a compelling, professional, and concise product description for an item titled "${title}". Focus on its utility for a college student. Describe the visual details of the product from the image provided. Return only the description text.`;
    
    const imagePart = await urlToGenerativePart(imageUrl);
    const result = await model.generateContent([prompt, imagePart]);
    
    return result.response.text();
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Failed to generate description. Please write manually.";
  }
}

async function verifyItemImage(title, imageUrl) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = `Does the image clearly show a product that matches the title "${title}"? Is the image quality acceptable and not blurry? Answer with ONLY "VALID" or "INVALID".`;
    
    const imagePart = await urlToGenerativePart(imageUrl);
    const result = await model.generateContent([prompt, imagePart]);
    const answer = result.response.text().trim();
    
    // Clean up potential markdown or punctuation
    if (answer.includes("VALID") && !answer.includes("INVALID")) return "VALID";
    return "INVALID";
  } catch (error) {
    console.error("Gemini Verification Error:", error);
    return "INVALID";
  }
}

module.exports = { generateDescription, verifyItemImage };
