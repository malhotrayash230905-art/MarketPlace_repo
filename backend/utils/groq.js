const Groq = require('groq-sdk');
const dotenv = require('dotenv');
dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || 'placeholder_api_key'
});

async function moderateText(text) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a content moderation AI for a college marketplace. Analyze the text for: 1. Offensive language. 2. Meaningless gibberish. 3. Scams. 4. Aggressive high-pressure sales urgency (e.g., 'buy fast', 'hurry up', 'immediately', 'act now'). Note: Well-written, professional, and detailed product descriptions (even if they sound like marketing) are completely fine and SHOULD be marked VALID. Only flag as INVALID if it contains offensive words, literal gibberish, or explicitly demands the user to 'buy fast' or 'act immediately'. Answer ONLY with 'VALID' if the text is safe. Answer 'INVALID' followed by a short reason if it violates the rules."
                },
                {
                    role: "user",
                    content: text
                }
            ],
            model: "llama-3.3-70b-versatile",
        });

        const response = completion.choices[0]?.message?.content || "";
        if (response.startsWith("VALID")) {
            return { isValid: true };
        } else {
            return { isValid: false, reason: response.replace("INVALID", "").trim() };
        }
    } catch (error) {
        console.error("Groq Moderation Error:", error);
        return { isValid: false, reason: "Service unavailable." };
    }
}

async function extractSearchKeywords(query) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Extract the core search keywords from the user's natural language query. Only return the keywords separated by spaces. E.g. 'Need a calculator for engineering maths' -> 'calculator engineering maths'"
                },
                {
                    role: "user",
                    content: query
                }
            ],
            model: "llama-3.3-70b-versatile",
        });

        return completion.choices[0]?.message?.content || query;
    } catch (error) {
        console.error("Groq Search Error:", error);
        return query;
    }
}

module.exports = { moderateText, extractSearchKeywords };
