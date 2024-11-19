import { jwtVerify } from 'jose';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    try {
      const secret = new TextEncoder().encode('sua-chave-secreta-super-segura-para-o-jwt-nutrimedica');
      const { payload } = await jwtVerify(token, secret);
      return res.status(200).json({ valid: true, decoded: payload });
    } catch (error) {
      return res.status(401).json({ valid: false, error: 'Invalid token' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}