import { NextApiRequest, NextApiResponse } from 'next';

import { PROFILE_KEY, TOKEN_KEY } from '@/features/profile/profile.constants';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.setHeader('Set-Cookie', `${TOKEN_KEY}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`);
    res.appendHeader(
      'Set-Cookie',
      `${PROFILE_KEY}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`
    );

    return res.status(200).send({ status: 'ok' });
  }

  return res.status(405).end();
}
