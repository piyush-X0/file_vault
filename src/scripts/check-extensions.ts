// import "dotenv/config";
// import { prisma } from "../lib/prisma";

//check-extension
// async function main() {
//     const result = await prisma.$queryRaw`SELECT extname FROM pg_extension;`;
//     console.log(result);
// }
// main().finally(() => prisma.$disconnect());


//check-column
// async function main() {
//     const result = await prisma.$queryRaw`
//         SELECT column_name, data_type
//         FROM information_schema.columns
//         WHERE table_name = 'DocumentChunk';
//     `;
//     console.log(result);
// }
// main().finally(() => prisma.$disconnect());


// check-normalization.ts
// import "dotenv/config";
// import { prisma } from "../lib/prisma";
// async function main() {
//     const rows: { embedding: string }[] = await prisma.$queryRaw`
//         SELECT embedding::text FROM "DocumentChunk"
//         WHERE "documentId" = 'cmsdq8kc300007kuzolk4km1i'
//         ORDER BY "chunkIndex"
//         LIMIT 1;
//     `;
//     const values = JSON.parse(rows[0].embedding);
//     const magnitude = Math.sqrt(values.reduce((sum: number, v: number) => sum + v * v, 0));
//     console.log("magnitude:", magnitude); // should be ~1.0
// }
// main().finally(() => prisma.$disconnect());