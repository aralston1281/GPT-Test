import { Redis } from '@upstash/redis';

const redisUrl = process.env.KV_REST_API_URL;
const redisToken = process.env.KV_REST_API_TOKEN;

if (!redisUrl || !redisToken) {
  throw new Error(
    '[Upstash Redis] Missing environment variables:\n' +
    `- KV_REST_API_URL: ${redisUrl ? '✅' : '❌ not set'}\n` +
    `- KV_REST_API_TOKEN: ${redisToken ? '✅' : '❌ not set'}\n\n` +
    'Make sure these are defined in your `.env.local` file and restart the dev server.'
  );
}

export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});
