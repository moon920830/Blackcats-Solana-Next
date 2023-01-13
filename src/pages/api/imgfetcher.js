

/**
 * @url /api/imgfetcher
 * @query include image url.
 */

export const config = {
    api: {
        bodyParser: false, // Disallow body parsing, consume as stream
    },
};

import nextConnect from "next-connect";
const app = nextConnect();

app.get(async (req, res) => {
    const url = decodeURIComponent(req.query.url);
    const result = await fetch(url);
    console.log("result:", result);
    const body = await result.body;

    body.pipe(res);
    res.status(200);
});

export default app;


