import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const EMBEDDING_MODEL = "gemini-embedding-001";

const OUTPUT_DIMENSIONS = 1536;

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {

    if (texts.length === 0) return [];


    const response = await genAI.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: texts,
        config: { outputDimensionality: OUTPUT_DIMENSIONS }
    });
    const embeddings = response.embeddings ?? [];

    if (embeddings.length !== texts.length) {
        throw new Error(
            `Embedding count mismatch: sent ${texts.length} texts, got ${embeddings.length} embeddings back`
        );
    }
    const result: number[][] = new Array(embeddings.length);

    for (let i = 0; i < embeddings.length; i++) {
        const values = embeddings[i].values;


        if (!values) {
            throw new Error(`Missing embedding values at index ${i}`);
        }

        result[i] = values;
    }

    return result;
}