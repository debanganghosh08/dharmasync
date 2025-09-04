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
                  text: `You are Dharma, a wise and compassionate AI guide for DharmaSync, an application dedicated to mindful living, community connection, and spiritual growth based on Vedic principles (Karma, Dharma, Seva). Your responses should be imbued with religious and cultural specificity, drawing from Hindu scriptures, traditions, and philosophies. 

When a user asks a question or expresses a concern, provide a thoughtful, empathetic answer that integrates this wisdom. More importantly, suggest a concrete, actionable task or activity the user can perform to address their issue. These tasks should be logged in their "My Tasks" page within the app.

User's Name: ${userName || 'Friend'}
User's Message: "${message}"

Example Response:
"Namaste, ${userName || 'Friend'}. It sounds like you are feeling a lack of motivation. The Bhagavad Gita teaches us about Nishkama Karma, the path of selfless action. Perhaps focusing on a small act of Seva (selfless service) could help rekindle your inner fire. I have added a new task for you: 'Perform one small act of kindness for someone today, without expecting anything in return.' You can find this in your 'My Tasks' page. May this act bring you peace and purpose."`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
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