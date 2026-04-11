export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const token = process.env.GITHUB_TOKEN;
    const repo = process.env.GITHUB_REPO; // e.g. "eric1alex/portfolio-website"

    if (!token || !repo) {
        return res.status(500).json({ error: 'Missing GITHUB_TOKEN or GITHUB_REPO env vars.' });
    }

    const { content } = req.body;
    if (!content) {
        return res.status(400).json({ error: 'No content provided.' });
    }

    const filePath = 'public/data/content.json';
    const apiBase = `https://api.github.com/repos/${repo}/contents/${filePath}`;
    const headers = {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
    };

    // Step 1: Get current file SHA (required by GitHub API to update a file)
    let sha;
    try {
        const getRes = await fetch(apiBase, { headers });
        if (getRes.ok) {
            const fileData = await getRes.json();
            sha = fileData.sha;
        } else if (getRes.status !== 404) {
            const err = await getRes.text();
            return res.status(500).json({ error: `GitHub GET failed: ${err}` });
        }
    } catch (e) {
        return res.status(500).json({ error: `Network error fetching file: ${e.message}` });
    }

    // Step 2: Encode content as Base64
    const encoded = Buffer.from(JSON.stringify(content, null, 2), 'utf-8').toString('base64');

    // Step 3: Commit the updated file
    const body = {
        message: `admin: update content.json [${new Date().toISOString()}]`,
        content: encoded,
        ...(sha ? { sha } : {}),
    };

    try {
        const putRes = await fetch(apiBase, {
            method: 'PUT',
            headers,
            body: JSON.stringify(body),
        });

        if (putRes.ok) {
            return res.status(200).json({ ok: true, message: 'Published successfully.' });
        } else {
            const err = await putRes.text();
            return res.status(500).json({ error: `GitHub commit failed: ${err}` });
        }
    } catch (e) {
        return res.status(500).json({ error: `Network error committing: ${e.message}` });
    }
}
