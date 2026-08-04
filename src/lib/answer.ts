import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CLAUDE_MODEL = "claude-sonnet-5";

export async function generateAnswer(question: string, contextChunks: string[]): Promise<string> {
    const context = contextChunks
        .map((chunk, i) => `[Excerpt ${i + 1}]\n${chunk}`)
        .join("\n\n");

    const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1024,
        system: "You are a study assistant. Answer the user's question using only the provided document excerpts. If the excerpts don't contain enough information to answer, say so clearly instead of guessing.",
        messages: [
            {
                role: "user",
                content: `Document excerpts:\n\n${context}\n\nQuestion: ${question}`
            }
        ]
    });

    const textBlock = response.content.find((block) => block.type === "text");
    return textBlock?.type === "text" ? textBlock.text : "";
}