import { redis } from '../../lib/redis';

export default async function handler(_, res) {
  const keys = await redis.keys('planner:*');
  const names = keys.map(k => k.replace('planner:', ''));
  res.status(200).json(names);
}
