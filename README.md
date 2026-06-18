# file-vault

built this to understand how file storage actually works.

files go directly from the browser to Cloudflare R2 via presigned URLs — the Next.js server only generates the signed URL, never touches the file bytes.

## what i learned

• presigned URLs (PUT for upload, GET for download)

• S3-compatible storage with Cloudflare R2

• Prisma + Neon Postgres for metadata

## stack

• Next.js 15

• Cloudflare R2

• Neon Postgres

• Prisma

• Tailwind CSS (minimal UI, not the focus)
