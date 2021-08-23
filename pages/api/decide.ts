import { Buffer } from 'buffer';
import { NextApiRequest, NextApiResponse } from 'next';

const tmpVariants = {
  'next-test': ['default', 'one'],
};

export default async function decide(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!req.query || !req.query.key) throw new Error('Key is required');

  const { key } = req.query;
  const [path, experiment] = Buffer.from(String(key), 'base64')
    .toString()
    .split('^');
  const variant = tmpVariants[experiment as keyof typeof tmpVariants][1]

  res.setHeader('Set-Cookie', [`${key}=${variant}`]);
  res.redirect(302, path);
}
