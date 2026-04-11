export default function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { password } = req.body;
    const secret = process.env.ADMIN_PASSWORD;

    if (!secret) {
        return res.status(500).json({ error: 'Server misconfigured: ADMIN_PASSWORD not set.' });
    }

    if (password === secret) {
        return res.status(200).json({ ok: true });
    }

    return res.status(401).json({ error: 'Unauthorized' });
}
