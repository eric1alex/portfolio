export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { folder = 'images' } = req.query;
    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO; // e.g. "eric1alex/portfolio-website"

    if (!token || !repo) {
        return res.status(500).json({ error: 'Missing GITHUB_TOKEN or GITHUB_REPO env vars.' });
    }

    const apiBase = `https://api.github.com/repos/${repo}/contents/public/${folder}`;
    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
    };

    try {
        const getRes = await fetch(apiBase, { headers });
        if (getRes.ok) {
            const files = await getRes.json();
            // Filter out non-image files (like .gitkeep or directories)
            const images = files
                .filter(f => f.type === 'file' && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f.name))
                .map(f => `/${folder}/${f.name}`);
            return res.status(200).json({ images });
        } else if (getRes.status === 404) {
            // Directory might not exist or be empty
            return res.status(200).json({ images: [] });
        } else {
            const err = await getRes.text();
            return res.status(500).json({ error: `GitHub GET failed: ${err}` });
        }
    } catch (e) {
        return res.status(500).json({ error: `Network error: ${e.message}` });
    }
}
