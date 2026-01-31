
import { Anthropic } from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || "",
});

export async function POST(req: Request) {
    try {
        const { text, tone } = await req.json();

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 });
        }

        if (!process.env.ANTHROPIC_API_KEY) {
            console.error("ANTHROPIC_API_KEY is not set");
            // Mock response for demo if Key is missing
            return NextResponse.json({
                response: `[SIMULATED ${tone} RESPONSE]: This is a placeholder because the Server Key is missing. But imagine a perfect ${tone} rewrite of: "${text.substring(0, 20)}..."`
            });
        }

        const systemPrompt = `You are an AI keyboard assistant. Your goal is to rewrite or respond to text messages based on a specific tone.
    The user will provide the input text (which might be a received message they want to reply to, or a draft they want to rewrite).
    
    TONE: ${tone}
    
    Guidelines:
    - Keep it concise (msg length).
    - strictly adhere to the requested tone.
    - If 'Seductive', be charming and allure but classy.
    - Professional: firm, polite.
    - Social Media: hashtags allowed.
    
    Output ONLY the suggested response.`;

        const msg = await anthropic.messages.create({
            model: "claude-3-haiku-20240307",
            max_tokens: 300,
            system: systemPrompt,
            messages: [
                { role: "user", content: `Context/Input: "${text}". \n\nGenerate a response.` }
            ],
        });

        // @ts-ignore - SDK typing might be slightly off in some versions or strict mode
        const responseText = msg.content[0].text;

        return NextResponse.json({ response: responseText });
    } catch (error) {
        console.error("Error generating response:", error);
        return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
    }
}
