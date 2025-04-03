import { redis } from '../../lib/redis';

export default async function handler(req, res) {
  const { name } = req.query;
  if (!name) return res.status(400).json({ error: 'Missing name' });
  const value = await redis.get(`planner:${name}`);
  if (!value) return res.status(404).json({ error: 'Not found' });
  res.status(200).json(value);
}
