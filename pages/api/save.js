import { redis } from '../../lib/redis';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, data } = req.body;
  if (!name || !data) return res.status(400).json({ error: 'Missing name or data' });
  await redis.set(`planner:${name}`, JSON.stringify(data));
  res.status(200).json({ message: 'Saved successfully' });
}
