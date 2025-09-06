import { type NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  console.log("GEMINI_API_KEY:", GEMINI_API_KEY ? "Key loaded successfully." : "Key not found.");

  if (!GEMINI_API_KEY) {
    return NextResponse.json({ error: "Gemini API key not found. Please check your .env.local file and restart the server." }, { status: 500 });
  }

  try {
    const { message, userName } = await request.json();

    const response = await fetch(
      // Corrected URL with the new model name from your curl command
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Corrected header for the API key
          "X-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are Navigator, a highly knowledgeable and compassionate guide integrated into the website. Your main purpose is to provide structured and actionable advice to users seeking clarity and guidance on life, mental well-being, and personal growth. When a user asks for guidance or a solution to a problem, you will not provide a simple paragraph. Instead, your response must be a professional and empathetic step-by-step roadmap or a detailed bullet-point list. Your answers should be structured with clear headings and bullet points, making them easy to read and follow.

User's Name: ${userName || 'Friend'}
User's Message: "${message}"

Example Response:
"Roadmap to Inner Calm

Step 1: Mindful Breathing. Find a quiet space and focus on your breath for 5 minutes. This anchors you in the present and reduces mental clutter.

Step 2: The Practice of Gratitude. At the end of each day, list three things you are grateful for. This simple act shifts your perspective from what you lack to what you have.

Step 3: Connect with Your Community. Reach out to a friend or family member for a brief conversation. Genuine connection can ground you and alleviate feelings of isolation."`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gemini API request failed:", errorBody);
      return NextResponse.json({ error: `Gemini API request failed: ${errorBody}` }, { status: response.status });
    }

    const data = await response.json();
    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "I am unable to provide a response at this moment. Please try again later.";

    return NextResponse.json({
      response: botResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: error.message || "Failed to process message" }, { status: 500 });
  }
}