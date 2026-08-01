import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
    const result = await prisma.$queryRaw`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'DocumentChunk';
    `;
    console.log(result);
}

main().finally(() => prisma.$disconnect());


// import "dotenv/config";
// import { prisma } from "../lib/prisma";

// async function main() {
//     const result = await prisma.$queryRaw`SELECT extname FROM pg_extension;`;
//     console.log(result);
// }

// main().finally(() => prisma.$disconnect());