import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CLAUDE_MODEL = "claude-sonnet-5";

export async function generateAnswer(question: string, contextChunks: string[]): Promise<string> {

}