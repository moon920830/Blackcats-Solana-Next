// import/no-unresolved
import nextConnect from "next-connect";
import axios from "axios";
import jwt from "jsonwebtoken";
// import app from "../app";
import { User } from "../../../../models/user";
import middleware from "../../../../middlewares";
// const User = require("../../../../models/user");

const app = nextConnect();
app.use(middleware);

/**
 * @url /api/auth/signup
 */
// eslint-disable-next-line consistent-return
app.post(async (req, res) => {
    // Extract the email, firstname, lastname, password, type and captcha code from the request body
    const { token, email, password, firstname, lastname, type } = req.body;
    // eslint-disable-next-line no-console
    console.log("req.body:", req.body);

    try {
        if (!token) {
            return res.status(422).json({
                message:
                    "Unproccesable request, please provide the required fields",
            });
        }
        // Ping the google recaptcha verify API to verify the captcha code you received
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
            {
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded; charset=utf-8",
                },
            }
        );

        const captchaValidation = await response.data;
        /**
       * The structure of response from the verify API is
       * {
       *  "success": true|false,
       *  "challenge_ts": timestamp,  // timestamp of the challenge load (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
       *  "hostname": string,         // the hostname of the site where the reCAPTCHA was solved
       *  "error-codes": [...]        // optional
        }
       */
        if (captchaValidation.success) {
            // Replace this with the API that will save the data received
            // to your backend
            // Return 200 if everything is successful
            const isExistEmail = await User.findOne({ email });
            if (isExistEmail) {
                return res.status(400).json({
                    message: "User already exists",
                });
            }

            const user = new User({
                email,
                password,
                firstname,
                lastname,
                type,
            });
            await user.save();
            // eslint-disable-next-line no-console
            console.log("user:", user);

            const payload = {
                user: {
                    _id: user._id,
                    email,
                    firstname,
                    lastname,
                    type,
                    avatar: user.avatar,
                    cover: user.cover,
                    bio: user.bio,
                },
            };

            jwt.sign(
                payload,
                "jwtSecret",
                { expiresIn: 36000 },
                (err, jwtToken) => {
                    if (err) throw err;
                    // console.log(jwtToken);
                    return res.status(200).json({
                        token: jwtToken,
                    });
                }
            );

            // return res.status(200).json({ message: "success" });
        } else {
            return res.status(422).json({
                message: "Unproccesable request, Invalid captcha code",
            });
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.status(422).json({ message: "Something went wrong" });
    }
});

export default app;
