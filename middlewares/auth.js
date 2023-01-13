import jwt from "jsonwebtoken";

export default async function auth(req, res, next) {
    console.log("token: ");

    const token = req.headers['x-auth-token'];
    // check if no token
    console.log("token: ", token);

    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied" });
    }

    // verify token
    try {
        const decoded = jwt.verify(token, "jwtSecret");
        console.log("decoded: ", decoded);

        req.user = decoded.user;
        return next();
    } catch (err) {
        return res.status(401).json({ error: "Token is not valid" });
    }
}
