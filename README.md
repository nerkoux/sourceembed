# @letsroti/sourceembed

Store embed JSON (or any raw text) to Cloudflare R2 and get a public URL back.

## Installation

```bash
npm install @letsroti/sourceembed
# or
yarn add @letsroti/sourceembed
```

## Usage

```typescript
import { SourceEmbed } from '@letsroti/sourceembed';

const sourceEmbed = new SourceEmbed({
  accessKeyId: process.env.R2_ACCESS_KEY_ID!,
  secretAccessKey: process.env.R2_ACCESS_KEY_SECRET!,
  endpoint: process.env.R2_ENDPOINT_URL!,
  bucket: 'roti-embed',
  publicDomain: 'raw.letsroti.com',
});

// Store a single embed JSON
const { key, url } = await sourceEmbed.store(JSON.stringify(embedData, null, 2));
console.log(url); // https://raw.letsroti.com/<uuid>.json

// Store multiple embeds at once
const results = await sourceEmbed.storeMany(jsonArrayOfStrings);
```

## Configuration

| Option           | Description                                     |
| ---------------- | ----------------------------------------------- |
| `accessKeyId`    | Cloudflare R2 access key ID                     |
| `secretAccessKey` | Cloudflare R2 secret access key                |
| `endpoint`       | R2 S3-compatible endpoint URL                   |
| `bucket`         | R2 bucket name                                  |
| `publicDomain`   | Public domain for serving files (without `https://`) |

## Environment Variables

Set these in your `.env` file (never commit credentials):

```env
R2_ACCESS_KEY_ID=your_access_key_id
R2_ACCESS_KEY_SECRET=your_secret_access_key
R2_ENDPOINT_URL=https://your-account-id.r2.cloudflarestorage.com
```

## License

MIT
